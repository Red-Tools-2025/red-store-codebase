"use client";

import React, { useState } from "react";
import useStoreServerFetch from "../hooks/management/ServerHooks/useStoreServerFetch";
import { Inventory, Store } from "@prisma/client";
import DropDownStoreSelect from "@/components/feature/management/feature-component/DropDownStoreSelect";
import { PosProvider } from "../contexts/pos/PosContext";
import { Cart } from "../types/pos/cart";
import useItems from "../hooks/pos/ServerHooks/useItems";
import { usePosAuth } from "../providers/PosAuthProvider"; // Import the Auth Context

interface POSLayoutProps {
  children: React.ReactNode;
}

const POSLayout: React.FC<POSLayoutProps> = ({ children }) => {
  const { isAuthenticated, isGettingToken, userData } = usePosAuth();

  const [selectedStore, setIsSelectedStore] = useState<Store | null>(null);
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const [clientSideItems, setClientSideItems] = useState<Inventory[] | null>(
    []
  );

  // Fetching store data and inventory data
  const { data: userStores, isLoading: isLoadingStores } = useStoreServerFetch(
    userData?.storeManagerId ? String(userData.storeManagerId) : ""
  );

  // Set initial store when stores are loaded
  React.useEffect(() => {
    if (userStores && userStores.length > 0 && !selectedStore) {
      setIsSelectedStore(userStores[0]);
    }
  }, [userStores]);

  const {
    handleResync,
    isLoading: isLoadingProducts,
    favoriteProducts,
    originalProducts,
  } = useItems(
    selectedStore ? String(selectedStore.storeId) : "",
    userData?.storeManagerId ?? "",
    setClientSideItems,
    1,
    20
  );

  // **Show loading while checking authentication**
  if (isGettingToken) {
    return <div>Loading authentication...</div>;
  }

  // **Show nothing if authentication fails (Redirect is handled in PosAuthProvider)**
  if (!isAuthenticated) {
    return null;
  }

  return (
    <PosProvider
      selectedStore={selectedStore}
      favoriteProducts={favoriteProducts}
      originalProducts={originalProducts}
      cartItems={cartItems}
      isLoading={isLoadingProducts}
      inventoryItems={clientSideItems}
      setCartItems={setCartItems}
      handleResync={handleResync}
      setClientSideItems={setClientSideItems}
    >
      <div className="p-5 font-inter">
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
      </div>
    </PosProvider>
  );
};

export default POSLayout;
