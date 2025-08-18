import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoIosStar } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import { BsFillBucketFill } from "react-icons/bs";
import { FaCalendarDays } from "react-icons/fa6";
import { usePos } from "@/app/contexts/pos/PosContext";
import { Bucket, Inventory, Store } from "@prisma/client";

import useBrowserCacheStorage from "@/app/hooks/pos/ServerHooks/useBrowserCacheStorage";
import CreateBucketModal from "../../Modals/CreateBucketModal";
import BucketsScheduleModal from "../../Modals/BucketsScheduleModal";
import { Input } from "@/components/ui/input";
import SyncModal from "../../Modals/SyncModal";

interface ProductDisplayControlProps {
  selectedStore: Store | null;
  buckets: (Bucket & { inventory: Inventory | null })[];
  bucketMode: boolean;
  toggleFavorites: boolean;
  setBucketMode: Dispatch<SetStateAction<boolean>>;
  setToggleFavorites: Dispatch<SetStateAction<boolean>>;
}

const ProductDisplayControl: React.FC<ProductDisplayControlProps> = ({
  bucketMode,
  toggleFavorites,
  selectedStore,
  setBucketMode,
  setToggleFavorites,
}) => {
  const { syncToServer, isSyncingToInventory, syncProgress } =
    useBrowserCacheStorage();
  const {
    scheduleMap,
    bucketMap,
    setSearchTerm,
    inventoryItems,
    favoriteProducts,
    searchTerm, // Ensure searchTerm is destructured here
  } = usePos();

  // States for bucket modals
  const [isBucketScheduleModalOpen, setIsBucketScheduleModalOpen] =
    useState<boolean>(false);
  const [isCreateBucketModalOpen, setIsCreateBucketModalOpen] =
    useState<boolean>(false);

  // Toggler for favorites
  const handleToggleFavorites = () => setToggleFavorites((prev) => !prev);

  // Toggler for Buckets
  const handleToggleBucketMode = () => setBucketMode(!bucketMode);

  // Auto Sync Logic
  useEffect(() => {
    if (!selectedStore?.storeId) return;

    const syncInterval = setInterval(() => {
      console.log("Syncing to server..."); // Debugging log
      syncToServer(selectedStore.storeId);
    }, 45 * 60 * 1000); // Sync every 30 seconds

    return () => clearInterval(syncInterval); // Cleanup on unmount
  }, [selectedStore?.storeId]);

  /* Dynamic Display control render based on bucket mode*/
  return (
    <>
      {/* All action modals here */}
      <SyncModal isOpen={isSyncingToInventory} syncProgress={syncProgress} />
      <CreateBucketModal
        isOpen={isCreateBucketModalOpen}
        onClose={() => setIsCreateBucketModalOpen(false)}
      />
      <BucketsScheduleModal
        isOpen={isBucketScheduleModalOpen}
        scheduleMap={scheduleMap}
        bucketMap={bucketMap}
        onClose={() => setIsBucketScheduleModalOpen(false)}
      />
      {selectedStore && selectedStore.storeId ? (
        <div
          className={`flex justify-between items-center ${
            !bucketMode ? "w-[70%]" : ""
          }`}
        >
          {/* Left group */}
          <div className="flex gap-2">
            {!bucketMode ? (
              <>
                <Button
                  onClick={() => syncToServer(selectedStore.storeId)}
                  variant="secondary"
                >
                  <div className="flex items-center">
                    <RefreshCw className="mr-2 h-3 w-3" />
                    <p>Sync to Inventory</p>
                  </div>
                </Button>
                <Button
                  onClick={handleToggleFavorites}
                  disabled={!favoriteProducts || favoriteProducts.length === 0}
                  variant="secondary"
                  className={
                    toggleFavorites
                      ? "bg-yellow-100 border-yellow-700 text-yellow-700"
                      : ""
                  }
                >
                  <div className="flex items-center">
                    <IoIosStar className="mr-2 h-3 w-3" />
                    <p>Favorites</p>
                  </div>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsCreateBucketModalOpen(true)}
                disabled={
                  !favoriteProducts ||
                  favoriteProducts.length === 0 ||
                  !inventoryItems ||
                  inventoryItems.length === 0
                }
                variant="secondary"
              >
                <div className="flex items-center">
                  <IoIosAddCircle className="mr-1 h-4 w-4" />
                  <p>Create Bucket</p>
                </div>
              </Button>
            )}
            <Button
              onClick={handleToggleBucketMode}
              disabled={
                !favoriteProducts ||
                favoriteProducts.length === 0 ||
                !inventoryItems ||
                inventoryItems.length === 0
              }
              variant="secondary"
              className={
                bucketMode ? "bg-blue-100 border-blue-700 text-blue-700" : ""
              }
            >
              <div className="flex items-center">
                <BsFillBucketFill className="mr-2 h-3 w-3" />
                <p>Buckets</p>
              </div>
            </Button>
          </div>

          {/* Right group */}
          <div className="flex gap-2">
            {bucketMode && (
              <Button
                onClick={() => setIsBucketScheduleModalOpen(true)}
                disabled={!scheduleMap}
              >
                <div className="flex items-center">
                  <FaCalendarDays className="mr-2 h-3 w-3" />
                  {/* Changed button text to "View Schedule" */}

                  <p>View Schedule</p>
                </div>
              </Button>
            )}
            {/* Search Bar */}
            {!bucketMode && (
              <Input
                className="border-gray-300 w-[300px] text-sm transition-all placeholder:text-gray-400"
                placeholder="Search product..."
                value={searchTerm} // Make it a controlled component
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <p>Initializing store details...</p>
      )}
    </>
  );
};

export default ProductDisplayControl;
