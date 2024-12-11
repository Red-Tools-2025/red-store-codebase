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
import { useRouter } from "next/navigation"; // For navigation
import { HandleRegisterInputObject } from "@/app/types/auth/register"; // Adjust path as needed
import useAuthServerHook from "@/app/hooks/auth/ServerHooks/useAuthServerHook"; // Adjust path as needed

export const RegisterForm = () => {
  const router = useRouter();
  const { handleRegister } = useAuthServerHook();
const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isPending, startTransition] = useTransition();
 const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone: "", // Add phone to default values
    },
  });

  const onRegister = (values: z.infer<typeof RegisterSchema>) => {
    const registerInput: HandleRegisterInputObject = {
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone || "", // Optional field, empty if not provided
      router,
      setError,
      setSuccess, // Assuming you want to show success as well
      setIsLoading, // Update state for loading (you can modify as needed)
    };
    handleRegister(registerInput);
  };

  return (
    <div>
      <CardWrapper
        headerHeading="SignUp"
        headerLabel="Create an account"
        backButtonLabel="Already have an account?"
        backButtonHref="/auth/login"
        showSocial
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onRegister)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                   {/*  <FormLabel>Name</FormLabel> */}
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Email</FormLabel> */}
                    <FormControl>
                      <Input
                        {...field}
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
                  {/*   <FormLabel>Password</FormLabel> */}
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                {/*     <FormLabel>Phone (optional)</FormLabel> */}
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Phone (Optional)"
                        type="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" className="w-full  font-inter mt-4" disabled={isPending}>
              Create an Account
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};
