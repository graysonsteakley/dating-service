import { z } from "zod";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";

import { publicProcedure, authedProcedure, router } from "../trpc";
import { Message } from "@prisma/client";
import { prisma } from "../../db";

interface MyEvents {
  add: (data: Message) => void;
  isTypingUpdate: () => void;
}
declare interface MyEventEmitter {
  on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  emit<TEv extends keyof MyEvents>(
    event: TEv,
    ...args: Parameters<MyEvents[TEv]>
  ): boolean;
}

class MyEventEmitter extends EventEmitter {}

// In a real app, you'd probably use Redis or something
const ee = new MyEventEmitter();

// who is currently typing, key is `name`
const currentlyTyping: Record<string, { lastTyped: Date; name: string }> =
  Object.create(null);

// every 1s, clear old "isTyping"
const interval = setInterval(() => {
  let updated = false;
  const now = Date.now();
  for (const [key, value] of Object.entries(currentlyTyping)) {
    if (now - value.lastTyped.getTime() > 3e3) {
      delete currentlyTyping[key];
      updated = true;
    }
  }
  if (updated) {
    ee.emit("isTypingUpdate");
  }
}, 3e3);
process.on("SIGTERM", () => clearInterval(interval));

export const messageRouter = router({
  add: authedProcedure
    .input(
      z.object({
        senderId: z.string().uuid().optional(),
        text: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, name } = ctx.user;
      if (!!name) {
        const message = await prisma?.message.create({
          data: {
            ...input,
            senderId: id,
            senderName: name,
          },
        });
        if (!!message) {
          ee.emit("add", message);
          delete currentlyTyping[id];
          ee.emit("isTypingUpdate");
          return message;
        }
      }
    }),

  isTyping: authedProcedure
    .input(z.object({ typing: z.boolean() }))
    .mutation(({ input, ctx }) => {
      const { id, name } = ctx.user;
      if (!input.typing) {
        delete currentlyTyping[id];
      } else {
        if (!!name) {
          currentlyTyping[id] = {
            lastTyped: new Date(),
            name,
          };
        }
      }
      ee.emit("isTypingUpdate");
    }),

  infinite: publicProcedure
    .input(
      z.object({
        id: z.number().nullish(),
        cursor: z.date(),
        take: z.number().min(1).max(50).nullish(),
      })
    )
    .query(async ({ input }) => {
      const take = input.take ?? 10;
      const cursor = input.cursor;
      const id = input.id;

      const messages = await prisma?.message.findMany({
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: id ?? 0 } : undefined,
        take: take + 1,
        skip: 0,
      });
      const items = messages?.reverse() ?? [];
      let prevCursor: null | typeof cursor = null;
      if (items.length > take) {
        const prev = items.shift();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        prevCursor = prev!.createdAt;
      }
      return {
        items,
        prevCursor,
      };
    }),

  onAdd: publicProcedure.subscription(() => {
    return observable<Message>((emit) => {
      const onAdd = (data: Message) => emit.next(data);
      ee.on("add", onAdd);
      return () => {
        ee.off("add", onAdd);
      };
    });
  }),

  whoIsTyping: publicProcedure.subscription(() => {
    let prev: Record<
      string,
      {
        lastTyped: Date;
        name: string;
      }
    > = {};
    return observable<
      Record<
        string,
        {
          lastTyped: Date;
          name: string;
        }
      >
    >((emit) => {
      const onIsTypingUpdate = () => {
        const newData = { ...currentlyTyping };
        if (!!currentlyTyping) {
          // const key = Object.keys(currentlyTyping);

          emit.next(newData);
          prev = newData;
        }
      };
      ee.on("isTypingUpdate", onIsTypingUpdate);
      return () => {
        ee.off("isTypingUpdate", onIsTypingUpdate);
      };
    });
  }),
});
