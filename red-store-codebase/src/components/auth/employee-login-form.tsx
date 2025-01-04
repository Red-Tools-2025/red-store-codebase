"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/auth/CardWrapper";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { signIn } from "next-auth/react";
import { useState } from "react";

const EmployeeLoginSchema = z.object({
  storeName: z.string().min(1, { message: "Store Name is required" }),
  employeePhone: z
    .string()
    .regex(/^[0-9]{10}$/, { message: "Phone number must be 10 digits" }),
  employeeName: z.string().min(1, { message: "Employee Name is required" }),
});

export const EmployeeLoginForm = () => {
  const [error, setError] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);
  const form = useForm<z.infer<typeof EmployeeLoginSchema>>({
    resolver: zodResolver(EmployeeLoginSchema),
    defaultValues: {
      storeName: "",
      employeePhone: "",
      employeeName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof EmployeeLoginSchema>) => {
    setError("");
    setIsPending(false);

    try {
      const result = await signIn("employeelogin", {
        redirect: false, // Prevent automatic redirection
        storeName: values.storeName,
        employeePhone: values.employeePhone,
        employeeName: values.employeeName,
      });

      if (result?.error) {
        setError(result.error); // Display error message
      } else if (result?.ok) {
        console.log(result);
        // Redirect only if authentication succeeds
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred during login.");
      console.error("Error logging in:", err);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <CardWrapper
      headerHeading="Employee Login"
      headerLabel="Login as Employee"
      backButtonLabel="Back to User Login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Store Name"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employeePhone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Phone Number"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employeeName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Employee Name"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full mt-4" disabled={isPending}>
            Login
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </Form>
    </CardWrapper>
  );
};
