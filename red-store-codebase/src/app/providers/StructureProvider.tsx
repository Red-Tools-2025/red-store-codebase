"use client";

import Header from "@/components/feature/global/Header";
import { usePathname } from "next/navigation";
import { useStoreContext } from "./StoreProvider";

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
  const { selectedStore } = useStoreContext();

  console.log({ selectedStore });

  return (
    <div className="flex-1">
      {!isAuthPage && <Header />}
      <div className="px-5">{children}</div>
    </div>
  );
}
