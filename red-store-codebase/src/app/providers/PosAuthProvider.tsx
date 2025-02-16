"use client";

import {
  ReactNode,
  useContext,
  useEffect,
  useState,
  createContext,
} from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";

interface TokenPayload {
  empId: number;
  empName: string;
  empPhone: string;
  storeId: number;
  storeManagerId: string;
}

interface PosAuthContextType {
  isAuthenticated: boolean;
  isGettingToken: boolean;
  userData: TokenPayload | null;
}

interface GetTokenResponse {
  userData: TokenPayload;
}

const PosAuthContext = createContext<PosAuthContextType | undefined>(undefined);

export const PosAuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGettingToken, setIsGettingToken] = useState(true);
  const [userData, setUserData] = useState<TokenPayload | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res: AxiosResponse<GetTokenResponse> = await axios.get(
          "/api/auth/moblogin/get-token",
          {}
        );
        if (!res.data.userData) {
          router.push("/auth/emp");
          return;
        }
        const data = await res.data;
        console.log({ data });
        // If your endpoint returns a JSON string, parse it; if it returns an object, use it directly.
        const payload: TokenPayload =
          typeof data.userData === "string"
            ? JSON.parse(data.userData)
            : data.userData;
        console.log({ payload });
        setUserData(payload);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        router.push("/auth/emp");
      } finally {
        setIsGettingToken(false);
      }
    };

    fetchUserData();
  }, [router]);

  const value = { isAuthenticated, isGettingToken, userData };

  return (
    <PosAuthContext.Provider value={value}>{children}</PosAuthContext.Provider>
  );
};

export const usePosAuth = () => {
  const context = useContext(PosAuthContext);
  if (!context) {
    throw new Error("usePosAuth must be used within a PosAuthProvider");
  }
  return context;
};
