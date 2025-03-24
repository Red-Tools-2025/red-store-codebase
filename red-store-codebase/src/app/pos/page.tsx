"use client";
import { usePos } from "../contexts/pos/PosContext";
import ItemSelectionDisplay from "@/components/feature/pos/feature-components/Displays/ItemSelectionDisplay";
import ProductDisplayControl from "@/components/feature/pos/feature-components/Panels/ProductDisplayControl";
import CartDisplay from "@/components/feature/pos/feature-components/Displays/CartDisplay";
import { ScrollArea } from "@/components/ui/scroll-area";
import BucketDisplay from "@/components/feature/pos/feature-components/Displays/BucketDisplay";
import { useState } from "react";

const POSPage = () => {
  const {
    selectedStore,
    inventoryItems,
    favoriteProducts,
    isLoading,
    bucketMode,
    setBucketMode,
    buckets,
    fetchError,
    isFetchingBuckets,
  } = usePos();
  // State for favorites
  const [toggleFavorites, setToggleFavorites] = useState<boolean>(false);
  return (
    <div className="flex flex-col h-screen">
      {/* Header Section */}
      <div className="py-3">
        <ProductDisplayControl
          selectedStore={selectedStore}
          bucketMode={bucketMode}
          toggleFavorites={toggleFavorites}
          buckets={buckets}
          setBucketMode={setBucketMode}
          setToggleFavorites={setToggleFavorites}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Scrollable Product Grid */}
        <ScrollArea className="flex-1">
          <div className="py-2 pr-4">
            {bucketMode ? (
              <BucketDisplay
                buckets={buckets}
                isFetching={isFetchingBuckets}
                fetchError={fetchError}
              />
            ) : (
              <ItemSelectionDisplay
                inventoryItems={
                  toggleFavorites ? favoriteProducts : inventoryItems
                }
                isLoading={isLoading}
              />
            )}
          </div>
        </ScrollArea>

        {/* Fixed Cart Section */}
        {!bucketMode ? <CartDisplay /> : <></>}
      </div>
    </div>
  );
};

export default POSPage;
