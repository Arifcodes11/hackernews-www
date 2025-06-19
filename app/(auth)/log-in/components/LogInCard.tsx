"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { z } from "zod";

import { Caption } from "@/components/ui/Caption";
import { RoundSpinner } from "@/components/ui/spinner";
import { emailSchema } from "@/lib/extras/schemas/email";

export const LogInCard = () => {
  const router = useRouter();
  const { data: session } = betterAuthClient.useSession();

  // Redirect if already logged in
  useEffect(() => {
    if (session && session.user) {
      router.push('/feeds');
    }
  }, [session, router]);

  const [logInError, setLogInError] = useState<Error | null>(null);
  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async (value) => {
      const { email, password } = value.value;
      try {
        const { error, response } = await betterAuthClient.signIn.email({
          email,
          password,
        });
        if (error || (response && !response.ok)) {
          const msg = error?.message || 'Unable to log in currently!';
          toast.error(msg);
          setLogInError(new Error(msg));
          return;
        }
        // If /feeds route exists, redirect
        try {
          await router.push('/feeds');
        } catch {
          const msg = "'/feeds' route does not exist. Please create 'app/(main)/feeds/page.tsx' or the appropriate file for your feeds page.";
          toast.error(msg);
          setLogInError(new Error(msg));
        }
      } catch {
        toast.error('An unexpected error occurred during login.');
        setLogInError(new Error('An unexpected error occurred during login.'));
      }
    },
  });


  
  return (
    <Card className="w-md">
      <CardHeader>
        <CardTitle>Welcome back!</CardTitle>
        <CardDescription>Enjoy HackerNews at its best</CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <form
          className="flex flex-col items-stretch gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}
        >
          {/* Email Field */}
          <Field
            name="email"
            validators={{
              onSubmit: (value) => {
                const { error } = emailSchema.safeParse(value.value);

                if (error && error.errors.length > 0) {
                  return error.errors[0].message;
                }
              },
            }}
          >
            {(field) => {
              return (
                <div className="flex flex-col items-stretch gap-2">
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    type="email"
                    placeholder="Email"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors?.length > 0 && (
                    <Caption variant="error">
                      {field.state.meta.errors.join(" | ")}
                    </Caption>
                  )}
                </div>
              );
            }}
          </Field>

          {/* Password Field */}
          <Field
            name="password"
            validators={{
              onSubmit: (value) => {
                const logInPasswordSchema = z
                  .string()
                  .min(1, "Password cannot be empty");

                const { error } = logInPasswordSchema.safeParse(value.value);

                if (error && error.errors.length > 0) {
                  return error.errors[0].message;
                }
              },
            }}
          >
            {(field) => {
              return (
                <div className="flex flex-col items-stretch gap-2">
                  <Label htmlFor={field.name}>Password</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    type="password"
                    placeholder="Password"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors?.length > 0 && (
                    <Caption variant="error">
                      {field.state.meta.errors.join(" | ")}
                    </Caption>
                  )}
                </div>
              );
            }}
          </Field>

          <Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting && <RoundSpinner />}
                Log In
              </Button>
            )}
          </Subscribe>
        </form>
      </CardContent>

      <Separator />

      {logInError !== null && (
        <>
          <CardContent>
            <Caption variant="error">{logInError.message}</Caption>
          </CardContent>
          <Separator />
        </>
      )}

      <CardContent className="flex py-2">
        Don&apos;t have an account ??{" "}
        <Link
          href="/sign-up"
          className="hover:underline hover:underline-offset-4 text-blue-600 "
        >
          <span className="px-2">Sign Up</span>
        </Link>
      </CardContent>

    </Card>
  );
};
