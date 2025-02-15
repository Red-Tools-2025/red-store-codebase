// components/OTPDialog.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Spinner } from "../ui/spinner";
import { FormError } from "../form-error";
import { BsPatchCheck, BsPatchExclamation } from "react-icons/bs";

interface OTPDialogProps {
  isOpen: boolean;
  error: string;
  isVerifyingOTP: boolean;
  isSendingOTP: boolean;
  OTPError: string;
  // Callback to pass the entered OTP back to the parent
  onVerifyOTP: (otp: string) => void;
}

const OTPDialog: React.FC<OTPDialogProps> = ({
  isOpen,
  error,
  OTPError,
  isSendingOTP,
  isVerifyingOTP,
  onVerifyOTP,
}) => {
  const [otpInput, setOtpInput] = useState<string>("");

  console.log(OTPError);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex gap-2 items-center">
              <p>Verify OTP</p>
              {isSendingOTP ? (
                <div className="text-xs flex items-center gap-1 border border-1 border-blue-500 text-blue-500 px-3 rounded-xl bg-blue-100">
                  <Spinner className="w-3 text-blue-500" />
                  <p className="font-normal">Sending...</p>
                </div>
              ) : (
                <>
                  {OTPError.length !== 0 ? (
                    <div className="flex text-xl items-center gap-1 border-red-500 text-red-500 rounded-xl">
                      <BsPatchExclamation className="bg-red-100 rounded-xl" />
                      <p className="text-sm font-medium">{OTPError}</p>
                    </div>
                  ) : (
                    <div className="flex text-xl items-center gap-1 border-blue-500 text-blue-500 rounded-xl bg-blue-100">
                      <BsPatchCheck />
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            An OTP was sent to your mobile number. Please enter the 6-digit code
            below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center">
          <FormError message={error} />
          <InputOTP
            onChange={(e) => setOtpInput(e)}
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <DialogFooter className="space-x-2">
          <Button
            variant="primary"
            onClick={() => onVerifyOTP(otpInput)}
            disabled={isVerifyingOTP || otpInput.length < 6}
          >
            {isVerifyingOTP ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">Verifying...</span>
                <Spinner className="text-white h-5" />
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              /* Add resend OTP logic if needed */
            }}
          >
            Resend OTP
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OTPDialog;
