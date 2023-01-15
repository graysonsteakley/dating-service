import { z } from "zod";

import { publicProcedure, authedProcedure, router } from "../trpc";
import { prisma } from "../../db";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(() => {
    return prisma.example.findMany();
  }),

  getSecretMessage: authedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
