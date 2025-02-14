"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
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
import { useState } from "react";
import { FormError } from "../form-error";
import { Spinner } from "../ui/spinner";
import { PhoneInput } from "../ui/phone-input";

const EmployeeLoginSchema = Yup.object().shape({
  storeName: Yup.string().required("Store Name is required"),
  employeePhone: Yup.string().required("Phone number is required"),
  employeeName: Yup.string().required("Employee Name is required"),
});

export const EmployeeLoginForm = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: yupResolver(EmployeeLoginSchema),
    defaultValues: {
      storeName: "",
      employeePhone: "",
      employeeName: "",
    },
  });

  const onSubmit = async (values) => {
    setError("");
    setIsLoading(true);
    console.log(values);

    // Simulate API request (replace with actual login logic)
    try {
      // Example API call
      // const result = await signIn("employeelogin", {
      //   redirect: false,
      //   ...values,
      // });
      // if (result?.error) {
      //   setError(result.error);
      // } else {
      //   console.log("Login successful", result);
      // }
    } catch (err) {
      setError("An unexpected error occurred during login.");
      console.error("Error logging in:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-inter">
      <CardWrapper
        headerHeading="Employee Login"
        headerLabel="Login as an Employee to your store"
        backButtonLabel=""
        backButtonHref=""
      >
        <FormError message={error} />
        <div className="my-5" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Store Name"
                      disabled={isLoading}
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
                    <PhoneInput
                      defaultCountry="IN"
                      {...field}
                      placeholder="Phone Number"
                      disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white">Signing in...</span>
                  <Spinner className="text-white h-5" />
                </div>
              ) : (
                "Log in"
              )}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};
