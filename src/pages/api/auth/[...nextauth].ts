import NextAuth, { type NextAuthOptions } from "next-auth";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "../../../server/db";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: {
          label: "Name",
          type: "text",
          placeholder: "Enter your name",
        },
      },
      async authorize(credentials, _req) {
        const user = { id: "1", name: credentials?.name ?? "J Smith" };
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // session: {
  //   strategy: "jwt",
  // },
};

export default NextAuth(authOptions);
