"use client";

import Sidebar from "@/components/feature/global/SideNav/Sidebar";
import { usePathname } from "next/navigation";

export default function StructureProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const whiteList: string[] = [
    "/auth/login",
    "/auth/register",
    "/test",
    "/auth/confirmed",
    "/auth/emp",
    "/pos",
  ];
  const pathname = usePathname();
  const isAuthPage = whiteList.includes(pathname);

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Sidebar */}
      {!isAuthPage && <Sidebar />}

      {/* Main content area */}
      <div className="flex-1 px-10  overflow-auto">{children}</div>
    </div>
  );
}
