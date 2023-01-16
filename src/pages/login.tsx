import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import Styles from "../styles/form.module.css";

import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Form } from "../components/inputs/form";
// import Nextauth from "./api/auth/[...nextauth]";

const LoginBtnGroup = () => {
  async function handleGoogleLogin() {
    signIn("google", {
      callbackUrl: "http://localhost:3000",
    });
  }

  async function handleFacebookLogin() {
    signIn("facebook", {
      callbackUrl: "https://localhost:3000",
    });
  }

  // const googleAuthUrl = Nextauth.providers.google.getAuthorizationUrl({
  //   redirectUri: `/auth/google/callback`,
  //   scope: "profile email",
  // });

  return (
    <>
      <div className={Styles.loginBtn}>
        <button type="submit">Login</button>
      </div>
      <div className="h-50 flex w-full justify-between">
        {/* <a href="/auth/google/callback"> */}
        <button
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className={`${Styles.btnGoogle} mb-2 inline-block rounded px-6 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg`}
          style={{ backgroundColor: "#ea4335" }}
          onClick={handleGoogleLogin}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
            className="h-4 w-4"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>
        {/* </a> */}
        <button
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          onClick={handleFacebookLogin}
          className={`${Styles.btnGoogle} mb-2 inline-block rounded px-6 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg`}
          style={{ backgroundColor: "#1877f2" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
            className="h-4 w-4"
          >
            <path
              fill="currentColor"
              d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
            />
          </svg>
          <span>Sign in with Facebook</span>
        </button>
      </div>
    </>
  );
};

const SignUpSchema = z.object({
  email: z.string().email("Enter a real email please."), // renders TextField
  password: z.string(),
  // address: z.string(),
  // favoriteColor: z.enum(["blue", "red", "purple"]),
  // over18: z.boolean(), // renders CheckBoxField
});

export default function Login() {
  const [error, setError] = useState<keyof Errors | null>(null);
  const router = useRouter();

  async function onFormSubmit(data: z.infer<typeof SignUpSchema>) {
    const response = await signIn("credentials", {
      ...data,
      redirect: false,
    });
    if (!!response?.error) {
      setError(response.error as keyof Errors);
    } else {
      router.push("/");
    }
  }

  return (
    <Layout>
      <Head>
        <title>Login</title>
      </Head>

      <section className="mx-auto flex w-3/4 flex-col">
        <div className="title">
          <h1 className="text-grey-800 py-6 text-4xl font-bold">
            Welcome to ...
          </h1>
          {/* <p className="mx-auto w-3/4 text-gray-400">Some subtext here</p> */}
        </div>
        {!!error && <SignInError error={error as keyof Errors} />}
        <Form
          schema={SignUpSchema}
          onSubmit={onFormSubmit}
          renderAfter={LoginBtnGroup}
          formProps={{
            className: "flex flex-col gap-5",
          }}
          props={{
            email: {
              placeholder: "Enter your email",
              classes: Styles.inputText,
              type: "email",
            },
            password: {
              placeholder: "Enter your password",
              classes: Styles.inputText,
              type: "password",
            },
          }}
        />

        <p className="py-3 text-center text-gray-400">
          Don't have an account yet?
          <Link className="px-2 text-blue-700" href="/create-account">
            Sign up
          </Link>
        </p>
      </section>
    </Layout>
  );
}

type Errors = {
  Signin: string;
  OAuthSignin: string;
  OAuthCallback: string;
  OAuthCreateAccount: string;
  EmailCreateAccount: string;
  Callback: string;
  OAuthAccountNotLinked: string;
  EmailSignin: string;
  CredentialsSignin: string;
  default: string;
};

const errors: Errors = {
  Signin: "Try signing with a different account.",
  OAuthSignin: "Try signing with a different account.",
  OAuthCallback: "Try signing with a different account.",
  OAuthCreateAccount: "Try signing with a different account.",
  EmailCreateAccount: "Try signing with a different account.",
  Callback: "Try signing with a different account.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "Check your email address.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  default: "Unable to sign in.",
};

const SignInError = ({ error }: { error?: keyof Errors }) => {
  const errorMessage = !!error && (errors[error] ?? errors.default);
  return <div className="w-full pb-4 text-red-600">{errorMessage}</div>;
};
