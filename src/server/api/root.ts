import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { userRouter } from "./routers/user.router.";
import { messageRouter } from "./routers/messages.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  messages: messageRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
