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
import { RegisterSchema } from "../../../schemas/index";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { useState, useTransition } from "react";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });



  return (
    <div>
      <CardWrapper
      headerHeading="Sign Up"
        headerLabel="Create an account"
        backButtonLabel="Already have an account?"
        backButtonHref="/auth/login"
        showSocial
      >
        <Form {...form}>
          <form >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="abc"
                      ></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                    {/*  // will render error */}
                  </FormItem>
                )}
              />
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
            <Button type="submit" className="w-full" disabled={isPending}>
              Create an Account
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};
