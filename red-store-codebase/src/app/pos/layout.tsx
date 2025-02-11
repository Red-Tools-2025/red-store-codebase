"use client";

import React, { useState } from "react";
import useStoreServerFetch from "../hooks/management/ServerHooks/useStoreServerFetch";
import { Inventory, Store } from "@prisma/client";
import DropDownStoreSelect from "@/components/feature/management/feature-component/DropDownStoreSelect";
import { PosProvider } from "../contexts/pos/PosContext";
import { Cart } from "../types/pos/cart";
import useItems from "../hooks/pos/ServerHooks/useItems";
import { useAuth } from "../providers/AuthProvider";
import SessionValidator from "@/components/feature/global/layouts/SessionValidator";

interface POSLayoutProps {
  children: React.ReactNode;
}

const POSLayout: React.FC<POSLayoutProps> = ({ children }) => {
  const { session, isLoading: isLoadingSession } = useAuth();
  const sessionUser = session?.user;

  const [selectedStore, setIsSelectedStore] = useState<Store | null>(null);

  // pagination

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

  const {
    handleResync,
    isLoading: isLoadingProducts,
    favoriteProducts,
    originalProducts,
  } = useItems(
    selectedStore ? String(selectedStore.storeId) : "",
    sessionUser?.id ?? "",
    setClientSideItems,
    1,
    20
  );

  return (
    <PosProvider
      selectedStore={selectedStore}
      favoriteProducts={favoriteProducts}
      originalProducts={originalProducts}
      cartItems={cartItems}
      isLoading={isLoadingProducts}
      inventoryItems={clientSideItems}
      sessionData={sessionUser ?? null}
      setCartItems={setCartItems}
      handleResync={handleResync}
      setClientSideItems={setClientSideItems}
    >
      <div className="p-5 font-inter">
        <SessionValidator session={session} isLoading={isLoadingSession}>
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
        </SessionValidator>
      </div>
    </PosProvider>
  );
};

export default POSLayout;
