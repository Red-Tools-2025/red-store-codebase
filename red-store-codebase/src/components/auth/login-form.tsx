"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { Spinner } from "../ui/spinner";

export const LoginForm = () => {
  const router = useRouter();
  const { handleLogin } = useAuthServerHook(); // Hook from the first code
  const [error, setError] = useState<string>("");
  const [success] = useState<string | undefined>("");
  const [isPending] = useTransition();
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
        headerHeading="Login"
        headerLabel="Please login to continue to your account"
        backButtonLabel="Need an account? Create One"
        backButtonHref="/auth/register"
        showSocial
      >
        <FormError message={error} />
        <div className="my-5" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    {/*  <FormLabel className="font-semibold">Email</FormLabel> */}
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-white  w-full"
                        disabled={isPending}
                        placeholder="Email"
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
                    {/*  <FormLabel className="font-semibold">Password</FormLabel> */}
                    <FormControl>
                      <Input
                        {...field}
                        className=" w-full"
                        disabled={isPending || isLoading}
                        placeholder="Password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormSuccess message={success} />
            <Button
              type="submit"
              className="w-full mt-4 font-inter"
              disabled={isPending}
            >
              {isLoading ? (
                <div className="flex flex-row ">
                  <p className="text-sm text-white">Almost There </p>
                  <Spinner className="text-white h-5" />
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};
