"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Store } from "@prisma/client";
import { DashBoardProvider } from "../contexts/dashboard/DashboardContext"; // Adjust path as needed
import DropDownStoreSelect from "@/components/feature/management/feature-component/DropDownStoreSelect"; // Adjust path as needed
import useStoreServerFetch from "../hooks/management/ServerHooks/useStoreServerFetch"; // Adjust path as needed
import { SessionUserType } from "../types/management/context";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  const sessionUser = session?.user as SessionUserType | undefined;

  const {
    data: storeData,
    error,
    isLoading,
  } = useStoreServerFetch(sessionUser?.id ?? ""); // Fetch store data
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  return (
    <DashBoardProvider storeData={storeData} selectedStore={selectedStore}>
      <div className="min-h-screen flex flex-col items-center">
        {session ? (
          <>
            {isLoading && !storeData?.length ? (
              <p>Loading...</p>
            ) : (
              <>
                {/* Header and Filter */}
                <div className="w-full bg-white pl-3 pr-9 pt-1  ml-8 flex justify-between items-center">
                  <h1 className="text-2xl font-bold">
                    {selectedStore
                      ? `${selectedStore.storeName} Dashboard`
                      : "Individual Store Dashboard"}
                  </h1>
                  <DropDownStoreSelect
                    data={storeData ?? []}
                    isDisabled={storeData?.length === 0}
                    setSelectedStore={setSelectedStore}
                    selectedStore={selectedStore}
                  />
                </div>

                {/* Dashboard Content */}
                <main className="w-full">{children}</main>
              </>
            )}
          </>
        ) : (
          <main className="flex-grow flex items-center justify-center">
            <p>Session not found. Please log in again.</p>
          </main>
        )}
      </div>
    </DashBoardProvider>
  );
};

export default DashboardLayout;
