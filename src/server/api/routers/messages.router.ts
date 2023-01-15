import { z } from "zod";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { Message } from "@prisma/client";

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
const currentlyTyping: Record<string, { lastTyped: Date }> =
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

export const messageRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        senderId: z.string().uuid().optional(),
        text: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = ctx.session.user;
      const message = await ctx.prisma?.message.create({
        data: {
          ...input,
          senderId: id,
        },
      });
      if (!!message) {
        ee.emit("add", message);
        delete currentlyTyping[id];
        ee.emit("isTypingUpdate");
        return message;
      }
    }),

  isTyping: protectedProcedure
    .input(z.object({ typing: z.boolean() }))
    .mutation(({ input, ctx }) => {
      const { id } = ctx.session.user;
      if (!input.typing) {
        delete currentlyTyping[id];
      } else {
        currentlyTyping[id] = {
          lastTyped: new Date(),
        };
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
    .query(async ({ input, ctx }) => {
      const take = input.take ?? 10;
      const cursor = input.cursor;
      const id = input.id;

      const messages = await ctx.prisma?.message.findMany({
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
    let prev: string[] | null = null;
    return observable<string[]>((emit) => {
      const onIsTypingUpdate = () => {
        const newData = Object.keys(currentlyTyping);

        if (!prev || prev.toString() !== newData.toString()) {
          emit.next(newData);
        }
        prev = newData;
      };
      ee.on("isTypingUpdate", onIsTypingUpdate);
      return () => {
        ee.off("isTypingUpdate", onIsTypingUpdate);
      };
    });
  }),
});
