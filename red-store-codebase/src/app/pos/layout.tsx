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
import useEmpDetails from "../hooks/pos/ServerHooks/useEmpDetails";

interface POSLayoutProps {
  children: React.ReactNode;
}

const POSLayout: React.FC<POSLayoutProps> = ({ children }) => {
  const { isAuthenticated, isGettingToken, userData } = usePosAuth();
  const { handleActivate, handleFinish } = useBucketServerActions();

  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const [clientSideItems, setClientSideItems] = useState<Inventory[] | null>(
    []
  );

  // States for buckets
  const [bucketMode, setBucketMode] = useState<boolean>(false);

  // States for search
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetching store data and inventory data
  // const { data: userStores, isLoading: isLoadingStores } = useStoreServerFetch(
  //   userData?.storeManagerId ? String(userData.storeManagerId) : ""
  // );

  const { store: storeData, isLoading: isLoadingStores } = useEmpDetails(
    userData?.storeId as number,
    userData?.storeManagerId as string
  );

  const {
    handleResync,
    handleReturns,
    setFavoriteProducts,
    isReturning,
    returnsError,
    isLoading: isLoadingProducts,
    favoriteProducts,
  } = useItems(
    storeData ? String(storeData.storeId) : "",
    userData?.storeManagerId ?? "",
    setClientSideItems
  );

  const { buckets, bucketMap, fetchError, isFetching, handleRefreshBuckets } =
    useBucketsFromServer(storeData?.storeId?.toString() || "");

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
      selectedStore={storeData}
      favoriteProducts={favoriteProducts}
      buckets={buckets}
      bucketMap={bucketMap}
      cartItems={cartItems}
      isLoading={isLoadingProducts}
      isFetchingBuckets={isFetching}
      isReturning={isReturning}
      fetchError={fetchError}
      returnsError={returnsError}
      searchTerm={searchTerm}
      inventoryItems={clientSideItems}
      bucketMode={bucketMode}
      setCartItems={setCartItems}
      handleResync={handleResync}
      handleReturns={handleReturns}
      handleRefreshBuckets={handleRefreshBuckets}
      setClientSideItems={setClientSideItems}
      setFavoriteProducts={setFavoriteProducts}
      setBucketMode={setBucketMode}
      setSearchTerm={setSearchTerm}
    >
      <div className="p-5 font-inter">
        {isLoadingStores ? (
          <div>Loading...</div>
        ) : storeData ? (
          <>
            <div className="flex justify-between">
              <h1 className="text-2xl font-semibold">Point of Sales</h1>
              <div className="flex gap-2">
                {/* <DropDownStoreSelect
                  data={storeData}
                  isDisabled={userStores.length === 0}
                  setSelectedStore={setIsSelectedStore}
                  selectedStore={selectedStore}
                /> */}
                {storeData.storeName}
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
