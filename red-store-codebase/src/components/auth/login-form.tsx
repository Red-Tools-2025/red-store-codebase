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
import * as z from "zod"
import { Input } from "@/components/ui/input";
import { LoginSchema } from "../../../schemas";
import {useForm} from "react-hook-form"
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { useState, useTransition } from "react";

export const LoginForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
   
  };

  return (
    <div>
      <CardWrapper
      headerHeading="Log in"
        headerLabel="Please login to continue to your account"
        backButtonLabel="Dont have an account"
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
                      ></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                    {/*  // will render error */}
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
                      ></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                    {/*  // will render error */}
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error}></FormError>
            <FormSuccess message={success}></FormSuccess>
            <Button type="submit" className="w-full  mt-4" disabled={isPending}>
              Sign in
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};
