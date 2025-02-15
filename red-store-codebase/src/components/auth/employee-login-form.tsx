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
import { HandleMobileLoginInputObject } from "@/app/types/auth/login";
import useAuthServerHook from "@/app/hooks/auth/ServerHooks/useAuthServerHook";

const EmployeeLoginSchema = Yup.object().shape({
  storeName: Yup.string().required("Store Name is required"),
  employeePhone: Yup.string().required("Phone number is required"),
  employeeName: Yup.string().required("Employee Name is required"),
});

export const EmployeeLoginForm = () => {
  const { handleEmployeeLogin } = useAuthServerHook();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingOTPVerification, setIsLoadingOTPVerification] =
    useState<boolean>(false);

  const form = useForm<Yup.InferType<typeof EmployeeLoginSchema>>({
    resolver: yupResolver(EmployeeLoginSchema),
    defaultValues: {
      storeName: "",
      employeePhone: "",
      employeeName: "",
    },
  });

  const onSubmit = async (
    values: Yup.InferType<typeof EmployeeLoginSchema>
  ) => {
    const loginInput: HandleMobileLoginInputObject = {
      empname: values.employeeName,
      empstore: values.storeName,
      phone: values.employeePhone,
      setError: setError,
      setIsLoading: setIsLoading,
      setIsLoadingOTPVerification: setIsLoadingOTPVerification,
    };
    console.log(loginInput);
    handleEmployeeLogin(loginInput, isLoading);
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
