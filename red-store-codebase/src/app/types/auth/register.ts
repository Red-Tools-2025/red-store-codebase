import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Dispatch, SetStateAction } from "react";

// function interfaces
export interface HandleRegisterInputObject {
  name: string;
  phone: string;
  password: string;
  email: string;
  router: AppRouterInstance;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
   setSuccess?: Dispatch<SetStateAction<string>>;
}

// server interfaces
export interface RegisterResponse {
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}
