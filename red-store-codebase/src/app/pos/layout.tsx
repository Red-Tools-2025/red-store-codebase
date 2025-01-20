"use client";

import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { SessionUserType } from "../types/management/context";
import useStoreServerFetch from "../hooks/management/ServerHooks/useStoreServerFetch";
import { Store } from "@prisma/client";
import DropDownStoreSelect from "@/components/feature/management/feature-component/DropDownStoreSelect";

interface POSLayoutProps {
  children: React.ReactNode;
}

const POSLayout: React.FC<POSLayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  const sessionUser = session?.user as SessionUserType | undefined;

  const [selectedStore, setIsSelectedStore] = useState<Store | null>(null);

  // Fetching store data and inventory data
  const { data: userStores, isLoading: isLoadingStores } = useStoreServerFetch(
    sessionUser?.id ?? ""
  );

  // Use useEffect to set initial store when stores are loaded
  React.useEffect(() => {
    if (userStores && userStores.length > 0 && !selectedStore) {
      setIsSelectedStore(userStores[0]);
    }
  }, [userStores]);

  return (
    <div className="p-5 font-inter">
      {session ? (
        <>
          {isLoadingStores ? (
            <div>Loading...</div>
          ) : userStores && userStores.length > 0 ? (
            <>
              <div className="flex justify-between">
                <h1 className="text-2xl font-semibold">Point of Sales</h1>
                <div className="flex gap-2">
                  <DropDownStoreSelect
                    data={userStores}
                    isDisabled={userStores.length === 0}
                    setSelectedStore={setIsSelectedStore}
                    selectedStore={selectedStore}
                  />
                </div>
              </div>
              {children}
            </>
          ) : (
            <div>No stores found</div>
          )}
        </>
      ) : (
        <main>Session not found. Please log in again.</main>
      )}
    </div>
  );
};

export default POSLayout;
