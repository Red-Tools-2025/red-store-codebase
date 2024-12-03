"use client";
import { useSession } from "next-auth/react";
import { SessionUserType } from "../types/management/context";

import React, { SetStateAction, useMemo, useState } from "react";
import DropDownStoreSelect from "@/components/feature/management/feature-component/DropDownStoreSelect";
import useStoreServerFetch from "../hooks/management/ServerHooks/useStoreServerFetch";
import { Store } from "@prisma/client";
import useProducts from "../hooks/inventory/FetchHooks/useProducts";
import { InventoryProvider } from "../contexts/inventory/InventoryContext";

interface ManagementPageLayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ManagementPageLayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  const sessionUser = session?.user as SessionUserType | undefined;

  const [selectedStore, setIsSelectedStore] = useState<Store | null>(null);

  // Fetching store data and inventory data
  const {
    data: userStores,
    error: storeServerFetchError,
    isLoading: isLoadingStores,
  } = useStoreServerFetch(sessionUser?.id ?? "");

  // Use useEffect to set initial store when stores are loaded
  React.useEffect(() => {
    if (userStores && userStores.length > 0 && !selectedStore) {
      setIsSelectedStore(userStores[0]);
    }
  }, [userStores]);

  const {
    error: InventoryFetchError,
    inventoryItems,
    message,
    isLoading: isLoadingProducts,
    handleRefresh,
  } = useProducts(
    selectedStore ? String(selectedStore.storeId) : "",
    sessionUser?.id ?? ""
  );

  const handleOpenModal = (
    setModalType: React.Dispatch<SetStateAction<boolean>>
  ) => {
    setModalType(true);
  };

  const handleCloseModal = (
    setModalType: React.Dispatch<SetStateAction<boolean>>
  ) => {
    setModalType(false);
  };

  return (
    <InventoryProvider
      handleRefresh={handleRefresh}
      selectedStore={selectedStore}
      isLoading={isLoadingProducts}
      inventoryItems={inventoryItems}
      sessionData={sessionUser ?? null}
    >
      <div className="p-5">
        {session ? (
          <>
            {isLoadingStores ? (
              <div>Loading...</div>
            ) : userStores && userStores.length > 0 ? (
              <>
                <div className="flex justify-between">
                  <h1 className="text-2xl font-semibold">Inventory Overview</h1>
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
    </InventoryProvider>
  );
};

export default Layout;
