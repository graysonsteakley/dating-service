import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        description: z.string(),
        headline: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.create({
        data: {
          ...input,
          name: input.name ?? ctx.session?.user?.name,
          email: input.email ?? ctx.session?.user?.email,
        },
      });
      return user ?? undefined;
    }),
  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany();

    return users ?? [];
  }),
});
