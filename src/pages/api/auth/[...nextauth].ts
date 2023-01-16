import { verify } from "argon2";
import NextAuth from "next-auth";
import { AppProviders } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "../../../common/validation/auth";
import { prisma } from "../../../server/db";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

let useMockProvider = process.env.NODE_ENV === "test";
const {
  GITHUB_CLIENT_ID,
  GITHUB_SECRET,
  NODE_ENV,
  APP_ENV,
  NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
} = process.env;
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

      const isValidPassword = await verify(user.password ?? "", creds.password);

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

providers.push(
  GoogleProvider({
    clientId: GOOGLE_CLIENT_ID ?? "",
    clientSecret: GOOGLE_CLIENT_SECRET ?? "",
  })
);

providers.push(
  FacebookProvider({
    clientId: FACEBOOK_CLIENT_ID ?? "",
    clientSecret: FACEBOOK_CLIENT_SECRET ?? "",
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
  pages: {
    error: "/login",
  },
  secret: NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    signIn: async ({ account, profile }) => {
      if (
        (!!account && !!profile && account.provider === "google") ||
        (!!account && !!profile && account.provider === "facebook")
      ) {
        const user = await prisma.user.findUnique({
          where: { email: profile.email },
        });
        console.log("found user", user);
        if (!user && !!profile?.name && !!profile?.email) {
          const newUser = await prisma.user.create({
            data: {
              name: profile.name,
              email: profile.email,
              username: profile.email,
            },
          });
          console.log("new user", newUser);
        }
        return true;
      }
      return true; // do other things for other providers
    },
    jwt: async ({ token, user }) => {
      if (!!user && !!user?.email) {
        const foundUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!!foundUser) {
          token.id = foundUser.id;
          token.email = foundUser.email;
          token.name = foundUser.name;
        }
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
