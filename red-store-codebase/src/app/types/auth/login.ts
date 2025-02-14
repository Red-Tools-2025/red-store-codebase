import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Dispatch, SetStateAction } from "react";

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

// server interfaces
export interface LoginResponse {
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}
