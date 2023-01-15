import { verify } from "argon2";
import NextAuth from "next-auth";
import { AppProviders } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginSchema } from "../../../common/validation/auth";
import { prisma } from "../../../server/db";
// import GithubProvider from "next-auth/providers/github";

let useMockProvider = process.env.NODE_ENV === "test";
const { GITHUB_CLIENT_ID, GITHUB_SECRET, NODE_ENV, APP_ENV, NEXTAUTH_SECRET } =
  process.env;
if (
  (NODE_ENV !== "production" || APP_ENV === "test") &&
  (!GITHUB_CLIENT_ID || !GITHUB_SECRET)
) {
  console.log("⚠️ Using mocked GitHub auth correct credentials were not added");
  useMockProvider = true;
}
const providers: AppProviders = [];
providers.push(
  // ...add more providers here
  Credentials({
    name: "credentials",
    credentials: {
      email: {
        label: "Email",
        type: "email",
        placeholder: "Enter your email",
      },
      password: {
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
      },
    },
    authorize: async (credentials) => {
      const creds = await loginSchema.parseAsync(credentials);

      const user = await prisma.user.findFirst({
        where: { email: creds.email },
      });

      if (!user) {
        return null;
      }

      const isValidPassword = await verify(user.password, creds.password);

      if (!isValidPassword) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
      };
    },
  })
);
// if (useMockProvider) {
//   providers.push(
//     CredentialsProvider({
//       id: "github",
//       name: "Mocked GitHub",
//       async authorize(credentials) {
//         if (credentials) {
//           const user = {
//             id: credentials.name,
//             name: credentials.name,
//             email: credentials.name,
//           };
//           return user;
//         }
//         return null;
//       },
//       credentials: {
//         name: { type: "test" },
//       },
//     })
//   );
// } else {
//   if (!GITHUB_CLIENT_ID || !GITHUB_SECRET) {
//     throw new Error("GITHUB_CLIENT_ID and GITHUB_SECRET must be set");
//   }
//   providers.push(
//     GithubProvider({
//       clientId: GITHUB_CLIENT_ID,
//       clientSecret: GITHUB_SECRET,
//       profile(profile) {
//         return {
//           id: profile.id,
//           name: profile.login,
//           email: profile.email,
//           image: profile.avatar_url,
//         } as any;
//       },
//     })
//   );
// }
export default NextAuth({
  // Configure one or more authentication providers
  providers,
  secret: NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token && session.user && !!token.id) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }

      return session;
    },
  },
});
