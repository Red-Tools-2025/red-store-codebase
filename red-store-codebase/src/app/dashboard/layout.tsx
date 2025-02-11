"use client";
import React, { useState } from "react";
import { Store } from "@prisma/client";
import { DashBoardProvider } from "../contexts/dashboard/DashboardContext"; // Adjust path as needed
import DropDownStoreSelect from "@/components/feature/management/feature-component/DropDownStoreSelect"; // Adjust path as needed
import useStoreServerFetch from "../hooks/management/ServerHooks/useStoreServerFetch"; // Adjust path as needed
import { useAuth } from "../providers/AuthProvider";
import SessionValidator from "@/components/feature/global/layouts/SessionValidator";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // loading session and getting all results
  const { session, isLoading: isLoadingSession } = useAuth();
  const sessionUser = session?.user;
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  console.log({ session });

  // Fetching relevant store data
  const { data: storeData, isLoading } = useStoreServerFetch(
    sessionUser?.id ?? ""
  );

  return (
    <DashBoardProvider storeData={storeData} selectedStore={selectedStore}>
      <div className="min-h-screen flex flex-col items-center">
        <SessionValidator session={session} isLoading={isLoadingSession}>
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
        </SessionValidator>
      </div>
    </DashBoardProvider>
  );
};

export default DashboardLayout;
