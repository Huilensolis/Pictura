"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SubmitHandler, useForm } from "react-hook-form";

import { PrimaryButton } from "@/components/ui/buttons/primary";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { AuthFormAreas } from "../auth-form.models";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";
import { useProtectRouteFromAuthUsers } from "@/utils/auth-validations/client-side-validations";
import { SignInAnonymouslyBtn } from "@/components/feature/sign-in-anonymously";

export default function SingUpPage() {
  const [wasEmailSent, setWasEmailSent] = useState<boolean>(false);
  const [wasAnErrorSendingEmail, setWasAnErrorSendingEmail] =
    useState<boolean>(false);

  useProtectRouteFromAuthUsers();

  const supabase = createClientComponentClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormAreas>({ mode: "all" });

  const handleSignUp: SubmitHandler<AuthFormAreas> = async (data) => {
    try {
      const res = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${location.origin}/auth/sign-up/callback`,
        },
      });
      if (res.error) {
        return setWasAnErrorSendingEmail(true);
      }
      setWasEmailSent(true);
      setWasAnErrorSendingEmail(false);
    } catch (error) {
      setWasAnErrorSendingEmail(true);
    }
  };

  return (
    <section className="flex flex-col gap-6 max-w-[530px]">
      <article className="flex flex-col gap-2">
        <div className="mb-2">
          <Logo />
        </div>
        <h1 className="text-neutral-900 dark:text-neutral-50 text-3xl font-medium">
          Sing Up
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          build your colection of your favourite images, create your profile and
          discover new images.
        </p>
      </article>
      <form
        className="flex flex-col gap-2"
        onSubmit={handleSubmit(handleSignUp)}
      >
        <Input
          type="text"
          id="email"
          label="Email"
          placeholder="myemail@gmail.com"
          register={register}
          error={errors.email}
          validationScheme={{
            required: { value: true, message: "email is required" },
            pattern: {
              value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              message: "incorrect email format",
            },
          }}
        />
        <Input
          type="password"
          id="password"
          label="Password"
          placeholder="*********"
          register={register}
          error={errors.password}
          validationScheme={{
            required: { value: true, message: "password is required" },
            minLength: {
              value: 8,
              message: "password must be at least 8 characters",
            },
          }}
        />
        <PrimaryButton
          isDisabled={isSubmitting || errors.root?.message ? true : false}
          isLoading={isSubmitting}
          style={{ marginTop: "0.5rem" }}
        >
          Sign Up
        </PrimaryButton>
        <div className="flex flex-col gap-2 mt-2">
          <span className="text-neutral-600 dark:text-neutral-400 text-center">
            Already have an account?{" "}
            <Link
              href="/auth/log-in"
              className="text-blue-500 dark:text-blue-400 font-bold hover:underline"
            >
              Log In
            </Link>
          </span>
          <span className="flex md:flex-row flex-col items-center justify-center gap-1 text-neutral-600 dark:text-neutral-400 text-center">
            Forgot your password?{" "}
            <Link
              href="/auth/recuperate-password"
              className="text-blue-500 dark:text-blue-400 font-bold hover:underline"
            >
              Recuperate Password
            </Link>
          </span>
        </div>
        {wasEmailSent && (
          <Alert
            type="succes"
            title="We sent you a confirmation email"
            description="Check your inbox"
            onClose={() => setWasEmailSent(false)}
          />
        )}
        {wasAnErrorSendingEmail && (
          <Alert
            type="error"
            title="Error"
            description="There was an error sending the confirmation email, please try again later"
            onClose={() => setWasAnErrorSendingEmail(false)}
          />
        )}
      </form>
      <section className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_20px_1fr] items-center justify-center gap-2 dark:text-neutral-300">
          <hr className="w-full h-[2px] bg-neutral-300 dark:bg-cm-lighter-gray" />
          or
          <hr className="w-full h-[2px] bg-neutral-300 dark:bg-cm-lighter-gray" />
        </div>
        <SignInAnonymouslyBtn />
      </section>
    </section>
  );
}
