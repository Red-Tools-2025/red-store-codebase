"use client";

import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { SessionUserType } from "../types/management/context";
import useStoreServerFetch from "../hooks/management/ServerHooks/useStoreServerFetch";
import { Inventory, Store } from "@prisma/client";
import DropDownStoreSelect from "@/components/feature/management/feature-component/DropDownStoreSelect";
import useProducts from "../hooks/inventory/FetchHooks/useProducts";
import { PosProvider } from "../contexts/pos/PosContext";
import { Cart } from "../types/pos/cart";
import useItems from "../hooks/pos/ServerHooks/useItems";

interface POSLayoutProps {
  children: React.ReactNode;
}

const POSLayout: React.FC<POSLayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  const sessionUser = session?.user as SessionUserType | undefined;

  const [selectedStore, setIsSelectedStore] = useState<Store | null>(null);

  // pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  // cart
  const [cartItems, setCartItems] = useState<Cart[]>([]);

  // inventory display states
  const [clientSideItems, setClientSideItems] = useState<Inventory[] | null>(
    []
  );

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

  // const {
  //   inventoryItems,
  //   isLoading: isLoadingProducts,
  //   total_count,
  //   handleResync,
  // } = useProducts(
  //   selectedStore ? String(selectedStore.storeId) : "",
  //   sessionUser?.id ?? "",
  //   currentPage,
  //   pageSize
  // );

  const { handleResync, isLoading: isLoadingProducts } = useItems(
    selectedStore ? String(selectedStore.storeId) : "",
    sessionUser?.id ?? "",
    setClientSideItems,
    currentPage,
    pageSize
  );

  return (
    <PosProvider
      cartItems={cartItems}
      setCartItems={setCartItems}
      handleResync={handleResync}
      isLoading={isLoadingProducts}
      inventoryItems={clientSideItems}
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
    </PosProvider>
  );
};

export default POSLayout;
