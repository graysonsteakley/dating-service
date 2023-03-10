import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { requireAuth } from "../common/requireAuth";
import { router } from "../server/api/trpc";
import { api } from "../utils/api";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

function AddMessageForm({ onMessageSend }: { onMessageSend: () => void }) {
  const addPost = api.messages.add.useMutation();
  const [message, setMessage] = useState("");
  const [enterToPostMessage, setEnterToPostMessage] = useState(true);
  async function sendMessage() {
    const input = {
      text: message,
    };
    try {
      await addPost.mutateAsync(input);
      setMessage("");
      onMessageSend();
    } catch {}
  }

  const isTyping = api.messages.isTyping.useMutation();

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          /**
           * In a real app you probably don't want to use this manually
           * Checkout React Hook Form - it works great with tRPC
           * @link https://react-hook-form.com/
           */
          await sendMessage();
        }}
      >
        <fieldset disabled={addPost.isLoading} className="min-w-0">
          <div className="flex w-full items-end rounded bg-gray-500 px-3 py-2 text-lg text-gray-200">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-transparent outline-0"
              rows={message.split(/\r|\n/).length}
              id="text"
              name="text"
              autoFocus
              onKeyDown={async (e) => {
                if (e.key === "Shift") {
                  setEnterToPostMessage(false);
                }
                if (e.key === "Enter" && enterToPostMessage) {
                  sendMessage();
                }
                isTyping.mutate({ typing: true });
              }}
              onKeyUp={(e) => {
                if (e.key === "Shift") {
                  setEnterToPostMessage(true);
                }
              }}
              onBlur={() => {
                setEnterToPostMessage(true);
                isTyping.mutate({ typing: false });
              }}
            />
            <div>
              <button type="submit" className="rounded bg-indigo-500 px-4 py-1">
                Submit
              </button>
            </div>
          </div>
        </fieldset>
        {addPost.error && (
          <p style={{ color: "red" }}>{addPost.error.message}</p>
        )}
      </form>
    </>
  );
}

export default function IndexPage() {
  const messagesQuery = api.messages.infinite.useInfiniteQuery(
    {},
    {
      getPreviousPageParam: (d) => d.prevCursor,
    }
  );
  const utils = api.useContext();
  const { hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage } =
    messagesQuery;

  // list of messages that are rendered
  const [messages, setMessages] = useState(() => {
    const msgs = messagesQuery.data?.pages.map((page) => page.items).flat();
    return msgs;
  });
  type Message = NonNullable<typeof messages>[number];
  const { data: session } = useSession();
  const username = session?.user?.name;
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  // fn to add and dedupe new messages onto state
  const addMessages = useCallback((incoming?: Message[]) => {
    setMessages((current) => {
      const map: Record<Message["id"], Message> = {};
      for (const msg of current ?? []) {
        map[msg.id] = msg;
      }
      for (const msg of incoming ?? []) {
        map[msg.id] = msg;
      }
      return Object.values(map).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
    });
  }, []);

  // when new data from `useInfiniteQuery`, merge with current state
  useEffect(() => {
    const msgs = messagesQuery.data?.pages.map((page) => page.items).flat();
    addMessages(msgs);
  }, [messagesQuery.data?.pages, addMessages]);

  const scrollToBottomOfList = useCallback(() => {
    if (scrollTargetRef.current == null) {
      return;
    }

    scrollTargetRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [scrollTargetRef]);
  useEffect(() => {
    scrollToBottomOfList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // subscribe to new messages and add
  api.messages.onAdd.useSubscription(undefined, {
    onData(message) {
      addMessages([message]);
    },
    onError(err) {
      console.error("Subscription error:", err);
      // we might have missed a message - invalidate cache
      utils.messages.infinite.invalidate();
    },
  });

  const [currentlyTyping, setCurrentlyTyping] = useState<string[]>([]);
  api.messages.whoIsTyping.useSubscription(undefined, {
    onData(data) {
      const names = Object.values(data).map((user) => user.name);
      setCurrentlyTyping(names);
    },
  });

  return (
    <>
      <Head>
        <title>Prisma Starter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen flex-col md:flex-row">
        <section className="flex w-full flex-col bg-gray-800 md:w-72">
          <div className="flex-1 overflow-y-hidden">
            <div className="flex h-full flex-col divide-y divide-gray-700">
              <header className="p-4">
                <h1 className="text-3xl font-bold text-gray-50">
                  tRPC WebSocket starter
                </h1>
                <p className="text-sm text-gray-400">
                  Showcases WebSocket + subscription support
                  <br />
                  <a
                    className="text-gray-100 underline"
                    href="https://github.com/trpc/examples-next-prisma-starter-websockets"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Source on GitHub
                  </a>
                </p>
              </header>
              <div className="hidden flex-1 space-y-6 overflow-y-auto p-4 text-gray-400 md:block">
                <article className="space-y-2">
                  <h2 className="text-lg text-gray-200">Introduction</h2>
                  <ul className="list-inside list-disc space-y-2">
                    <li>Open inspector and head to Network tab</li>
                    <li>All client requests are handled through WebSockets</li>
                    <li>
                      We have a simple backend subscription on new messages that
                      adds the newly added message to the current state
                    </li>
                  </ul>
                </article>
                {username && (
                  <article>
                    <h2 className="text-lg text-gray-200">User information</h2>
                    <ul className="space-y-2">
                      <li className="text-lg">
                        You&apos;re{" "}
                        <input
                          id="name"
                          name="name"
                          type="text"
                          disabled
                          className="bg-transparent"
                          value={username}
                        />
                      </li>
                      <li>
                        <button onClick={() => signOut()}>Sign Out</button>
                      </li>
                    </ul>
                  </article>
                )}
              </div>
            </div>
          </div>
          <div className="hidden h-16 flex-shrink-0 md:block"></div>
        </section>
        <div className="flex-1 overflow-y-hidden md:h-screen">
          <section className="flex h-full flex-col justify-end space-y-4 bg-gray-700 p-4">
            <div className="space-y-4 overflow-y-auto">
              <button
                data-testid="loadMore"
                onClick={() => fetchPreviousPage()}
                disabled={!hasPreviousPage || isFetchingPreviousPage}
                className="rounded bg-indigo-500 px-4 py-2 text-white disabled:opacity-40"
              >
                {isFetchingPreviousPage
                  ? "Loading more..."
                  : hasPreviousPage
                  ? "Load More"
                  : "Nothing more to load"}
              </button>
              <div className="space-y-4">
                {messages?.map((message) => (
                  <article key={message.id} className=" text-gray-50">
                    <header className="flex space-x-2 text-sm">
                      <h3 className="text-md">
                        {!!message && (
                          <a
                            href={`/profile/${message.senderName}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {message.senderName}
                          </a>
                        )}
                      </h3>
                      <span className="text-gray-500">
                        {new Intl.DateTimeFormat("en-GB", {
                          dateStyle: "short",
                          timeStyle: "short",
                        }).format(message.createdAt)}
                      </span>
                    </header>
                    <p className="whitespace-pre-line text-xl leading-tight">
                      {message.text}
                    </p>
                  </article>
                ))}
                <div ref={scrollTargetRef}></div>
              </div>
            </div>
            <div className="w-full">
              <AddMessageForm onMessageSend={() => scrollToBottomOfList()} />
              <p className="h-2 italic text-gray-400">
                {currentlyTyping.length
                  ? `${currentlyTyping.join(", ")} typing...`
                  : ""}
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
