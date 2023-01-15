import { router, publicProcedure } from "../../server/api/trpc";
import { exampleRouter } from "./routers/example";
import { messageRouter } from "./routers/messages.router";
import { userRouter } from "./routers/user.router.";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),

  example: exampleRouter,
  messages: messageRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
