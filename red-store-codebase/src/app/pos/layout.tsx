"use client";

import React, { useState } from "react";
import useStoreServerFetch from "../hooks/management/ServerHooks/useStoreServerFetch";
import { Inventory, Store } from "@prisma/client";
import DropDownStoreSelect from "@/components/feature/management/feature-component/DropDownStoreSelect";
import { PosProvider } from "../contexts/pos/PosContext";
import { Cart } from "../types/pos/cart";
import useItems from "../hooks/pos/ServerHooks/useItems";
import { usePosAuth } from "../providers/PosAuthProvider"; // Import the Auth Context
import useBucketsFromServer from "../hooks/pos/ServerHooks/useBucketsFromServer";
import useBucketAutoTrigger from "../hooks/pos/StaticHooks/useBucketAutoTriggers";
import useBucketServerActions from "../hooks/pos/ServerHooks/useBucketServerActions";

interface POSLayoutProps {
  children: React.ReactNode;
}

const POSLayout: React.FC<POSLayoutProps> = ({ children }) => {
  const { isAuthenticated, isGettingToken, userData } = usePosAuth();
  const { handleActivate, handleFinish } = useBucketServerActions();

  const [selectedStore, setIsSelectedStore] = useState<Store | null>(null);
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const [clientSideItems, setClientSideItems] = useState<Inventory[] | null>(
    []
  );

  const [bucketMode, setBucketMode] = useState<boolean>(false);

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

  const { buckets, bucketMap, fetchError, isFetching, handleRefreshBuckets } =
    useBucketsFromServer(selectedStore?.storeId?.toString() || "");

  const scheduleMap = useBucketAutoTrigger(
    buckets,
    handleActivate,
    handleFinish,
    handleRefreshBuckets
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
      scheduleMap={scheduleMap}
      selectedStore={selectedStore}
      favoriteProducts={favoriteProducts}
      originalProducts={originalProducts}
      buckets={buckets}
      bucketMap={bucketMap}
      cartItems={cartItems}
      isLoading={isLoadingProducts}
      isFetchingBuckets={isFetching}
      fetchError={fetchError}
      inventoryItems={clientSideItems}
      bucketMode={bucketMode}
      setCartItems={setCartItems}
      handleResync={handleResync}
      handleRefreshBuckets={handleRefreshBuckets}
      setClientSideItems={setClientSideItems}
      setBucketMode={setBucketMode}
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
