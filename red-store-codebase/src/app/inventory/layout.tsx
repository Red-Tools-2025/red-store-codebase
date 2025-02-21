"use client";
import { useSession } from "next-auth/react";
import { SessionUserType } from "../types/management/context";

import React, { useState } from "react";
import DropDownStoreSelect from "@/components/feature/management/feature-component/DropDownStoreSelect";
import useStoreServerFetch from "../hooks/management/ServerHooks/useStoreServerFetch";
import { Store } from "@prisma/client";
import useProducts from "../hooks/inventory/ServerHooks/useProducts";
import { InventoryProvider } from "../contexts/inventory/InventoryContext";
import useScanner from "../hooks/scanner/StaticHooks/useScanner";
import useSearch from "../hooks/inventory/ServerHooks/useSearch";

interface ManagementPageLayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ManagementPageLayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  // trigger intialization on load time via layout
  const { initializedScanner, license } = useScanner();
  const sessionUser = session?.user as SessionUserType | undefined;

  const [selectedStore, setIsSelectedStore] = useState<Store | null>(null);

  // pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // inventory items
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState<boolean>(false);

  // Fetching store data, inventory data & search keys
  const { data: userStores, isLoading: isLoadingStores } = useStoreServerFetch(
    sessionUser?.id ?? ""
  );

  // toggling info panel
  const toggleInfoPanel = () => setIsInfoPanelOpen(!isInfoPanelOpen);

  // Use useEffect to set initial store when stores are loaded
  React.useEffect(() => {
    if (userStores && userStores.length > 0 && !selectedStore) {
      setIsSelectedStore(userStores[0]);
    }
   
  }, [userStores]);

  const { fetchingKeys, searchKeys } = useSearch(
    selectedStore ? String(selectedStore.storeId) : "",
    sessionUser?.id ?? ""
  );

  const {
    inventoryItems,
    isLoading: isLoadingProducts,
    total_count,
    handleRefresh,
  } = useProducts(
    selectedStore ? String(selectedStore.storeId) : "",
    sessionUser?.id ?? "",
    currentPage,
    pageSize
  );

  return (
    <InventoryProvider
      toggleInfoPanel={toggleInfoPanel}
      infoPanelOpenState={isInfoPanelOpen}
      searchKeys={searchKeys}
      total_count={total_count}
      pageSize={pageSize}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      setPageSize={setPageSize}
      intializedScanner={initializedScanner}
      license={license}
      handleRefresh={handleRefresh}
      selectedStore={selectedStore}
      isLoading={isLoadingProducts}
      inventoryItems={inventoryItems}
      sessionData={sessionUser ?? null}
    >
      <div className="p-5 font-inter">
        {session ? (
          <>
            {isLoadingStores ? (
              fetchingKeys ? (
                <div>Getting your search keys...</div>
              ) : (
                <div>Loading...</div>
              )
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
