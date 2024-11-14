"use client";

import Sidebar from "@/components/feature/global/SideNav/Sidebar";
import { usePathname } from "next/navigation";

export default function StructureProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/auth/login" ||
    pathname === "/auth/register" ||
    pathname === "/test";

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Sidebar */}
      {!isAuthPage && <Sidebar />}

      {/* Main content area */}
      <div className="flex-1 px-10  overflow-auto">{children}</div>
    </div>
  );
}
