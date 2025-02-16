"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import StructureProvider from "@/app/providers/StructureProvider";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { PosAuthProvider } from "../providers/PosAuthProvider";

const ClientLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isPOSPage = pathname.startsWith("/pos");

  return isPOSPage ? (
    <PosAuthProvider>{children}</PosAuthProvider>
  ) : (
    <AuthProvider>
      <StructureProvider>{children}</StructureProvider>
    </AuthProvider>
  );
};

export default ClientLayout;
