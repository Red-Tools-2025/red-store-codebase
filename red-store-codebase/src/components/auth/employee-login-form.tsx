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
import { Dispatch, SetStateAction, useState } from "react";
import { FormError } from "../form-error";
import { Spinner } from "../ui/spinner";
import { PhoneInput } from "../ui/phone-input";
import useAuthServerHook from "@/app/hooks/auth/ServerHooks/useAuthServerHook";
import OTPDialog from "./OTPDialog";

const EmployeeLoginSchema = Yup.object().shape({
  storeName: Yup.string().required("Store Name is required"),
  employeePhone: Yup.string().required("Phone number is required"),
  employeeName: Yup.string().required("Employee Name is required"),
});

export const EmployeeLoginForm = () => {
  const { handleSendOTP, handleVerifyOTP, handleEmployeeLogin } =
    useAuthServerHook();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // for OTP
  const [OTPError, setOTPError] = useState<string>("");
  const [isSendingOTP, setIsSendingOTP] = useState<boolean>(false);
  const [OTPTemporaryClient, setOTPTemporaryClient] = useState<string>("");
  const [isVerifyingOTP, setIsVerifyingOTP] = useState<boolean>(false);
  const [openOTPDialog, setOpenOTPDialog] = useState<boolean>(false);

  // Save form values for later use during OTP verification
  const [formValues, setFormValues] = useState<{
    storeName: string;
    employeePhone: string;
    employeeName: string;
  } | null>(null);

  const form = useForm<Yup.InferType<typeof EmployeeLoginSchema>>({
    resolver: yupResolver(EmployeeLoginSchema),
    defaultValues: {
      storeName: "",
      employeePhone: "",
      employeeName: "",
    },
  });

  // for resending OTP
  const handleResendOTP = async (
    setIsResending: Dispatch<SetStateAction<boolean>>
  ) => {
    setIsResending(true);
    await handleSendOTP({
      phone: formValues?.employeePhone ?? "",
      setIsSendingOTP,
      setOTPError,
      setOTPTemporaryClient,
    });
    setIsResending(false);
  };

  // When form is submitted, send OTP and store values for later use
  const onSubmit = async (
    values: Yup.InferType<typeof EmployeeLoginSchema>
  ) => {
    setError("");
    setFormValues(values);
    setIsLoading(true);
    // Send OTP to the phone number
    setOpenOTPDialog(true);
    await handleSendOTP({
      phone: values.employeePhone,
      setOTPError,
      setOTPTemporaryClient,
      setIsSendingOTP,
    });
    setIsLoading(false);
  };

  // Callback when OTP is entered in the dialog
  const onVerifyOTP = async (enteredOtp: string) => {
    if (!formValues) return;
    await handleVerifyOTP({
      phone: formValues.employeePhone,
      empname: formValues.employeeName,
      empstore: formValues.storeName,
      otp: enteredOtp,
      setOTPError,
      setIsVerifyingOtp: setIsVerifyingOTP,
      OTPTemporaryClient,
      setOpenOTPDialog,
      onSuccess: async () => {
        await handleEmployeeLogin({
          empname: formValues.employeeName,
          empstore: formValues.storeName,
          phone: formValues.employeePhone,
          setError: setError,
          setIsLoading: setIsLoading,
        });
        console.log("Login successful:");
      },
    });
  };

  return (
    <div className="font-inter">
      <OTPDialog
        OTPError={OTPError}
        error={error}
        isSendingOTP={isSendingOTP}
        isVerifyingOTP={isVerifyingOTP}
        isOpen={openOTPDialog}
        onVerifyOTP={onVerifyOTP}
        handleResendOTP={handleResendOTP}
      />
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
