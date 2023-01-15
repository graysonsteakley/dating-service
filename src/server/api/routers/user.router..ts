import { publicProcedure, router } from "../trpc";
import { prisma } from "../../db";
import { signUpSchema } from "../../../common/validation/auth";
import { TRPCError } from "@trpc/server";
import { hash } from "argon2";

export const userRouter = router({
  createUser: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ input }) => {
      const { username, email, password, name } = input;

      const exists = await prisma.user.findFirst({
        where: { email },
      });

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists.",
        });
      }

      const hashedPassword = await hash(password);

      const result = await prisma.user.create({
        data: { name, username, email, password: hashedPassword },
      });

      return {
        status: 201,
        message: "Account created successfully",
        result: result.email,
      };
    }),
  getAllUsers: publicProcedure.query(async () => {
    const users = await prisma.user.findMany();
    return users ?? [];
  }),
});
