import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Dispatch, SetStateAction } from "react";
import { MessageStatus } from "twilio/lib/rest/api/v2010/account/message";

// function interfaces
export interface HandleLoginInputObject {
  email: string;
  password: string;
  router: AppRouterInstance;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
}

export interface HandleMobileLoginInputObject {
  empname: string;
  empstore: string;
  phone: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
}

export interface HandleVerifyInputOTPObject {
  phone: string;
  setOpenOTPDialog: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
}

// server interfaces
export interface LoginResponse {
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface MobileLoginResponse {
  verifiedRedirect: boolean;
}

export interface MobileOtpResponse {
  message: string;
  condition: MessageStatus;
  otp: string;
  expiryTime: number;
}
