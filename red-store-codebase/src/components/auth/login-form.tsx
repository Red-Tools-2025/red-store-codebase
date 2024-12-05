"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/CardWrapper";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "../../../schemas";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { useState, useTransition } from "react";
import { HandleLoginInputObject } from "@/app/types/auth/login";
import useAuthServerHook from "@/app/hooks/auth/ServerHooks/useAuthServerHook";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const router = useRouter();
  const { handleLogin } = useAuthServerHook(); // Hook from the first code
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    const loginInput: HandleLoginInputObject = {
      email: values.email,
      password: values.password,
      router,
      setError,
      setIsLoading,
    };
    handleLogin(loginInput); // Call handleLogin from the first code
  };

  return (
    <div>
      <CardWrapper
        headerHeading="Log in"
        headerLabel="Please login to continue to your account"
        backButtonLabel="Don't have an account"
        backButtonHref="/auth/register"
        showSocial
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="abc.xyz@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="******"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              Sign in
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};
