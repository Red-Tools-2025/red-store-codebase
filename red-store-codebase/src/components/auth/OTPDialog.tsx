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

interface OTPDialogProps {
  isOpen: boolean;
  error: string;
  isVerifyingOTP: boolean;
  // Callback to pass the entered OTP back to the parent
  onVerifyOTP: (otp: string) => void;
}

const OTPDialog: React.FC<OTPDialogProps> = ({
  isOpen,
  error,
  isVerifyingOTP,
  onVerifyOTP,
}) => {
  const [otpInput, setOtpInput] = useState<string>("");

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify OTP</DialogTitle>
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
