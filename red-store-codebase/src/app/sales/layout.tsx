"use client";
import { useSession } from "next-auth/react";
import { SessionUserType } from "../types/management/context";

import React, { useState } from "react";
import DropDownStoreSelect from "@/components/feature/management/feature-component/DropDownStoreSelect";
import useStoreServerFetch from "../hooks/management/ServerHooks/useStoreServerFetch";
import { Store } from "@prisma/client";
import { SalesProvider } from "../contexts/sales/SalesContext";

interface ManagementPageLayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ManagementPageLayoutProps> = ({ children }) => {
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
    <SalesProvider
      selectedStore={selectedStore}
      sessionData={sessionUser ?? null}
    >
      <div className="p-5 font-inter">
        {session ? (
          <>
            {isLoadingStores ? (
              <div>Loading...</div>
            ) : userStores && userStores.length > 0 ? (
              <>
                <div className="flex justify-between">
                  <h1 className="text-2xl font-semibold">Sales Overview</h1>
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
    </SalesProvider>
  );
};

export default Layout;
