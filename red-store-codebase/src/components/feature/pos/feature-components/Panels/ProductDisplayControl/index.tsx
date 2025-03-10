import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { IoIosStar } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import { BsFillBucketFill } from "react-icons/bs";
import { FaCalendarDays } from "react-icons/fa6";
import { usePos } from "@/app/contexts/pos/PosContext";
import { Bucket, Inventory, Store } from "@prisma/client";

import useBrowserCacheStorage from "@/app/hooks/pos/ServerHooks/useBrowserCacheStorage";
import CreateBucketModal from "../../Modals/CreateBucketModal";
import BucketsScheduleModal from "../../Modals/BucketsScheduleModal";

interface ProductDisplayControlProps {
  selectedStore: Store | null;
  favoriteProducts: Inventory[] | null;
  originalProducts: Inventory[] | null;
  buckets: (Bucket & { inventory: Inventory | null })[];
  bucketMode: boolean;
  setBucketMode: Dispatch<SetStateAction<boolean>>;
  setClientSideItems: Dispatch<SetStateAction<Inventory[] | null>>;
}

const ProductDisplayControl: React.FC<ProductDisplayControlProps> = ({
  bucketMode,
  favoriteProducts,
  originalProducts,
  selectedStore,
  setBucketMode,
  setClientSideItems,
}) => {
  const { syncToServer } = useBrowserCacheStorage();
  const { scheduleMap, bucketMap } = usePos();
  const [toggleFavorites, setToggleFavorites] = useState<boolean>(false);
  const [isBucketScheduleModalOpen, setIsBucketScheduleModalOpen] =
    useState<boolean>(false);
  const [isCreateBucketModalOpen, setIsCreateBucketModalOpen] =
    useState<boolean>(false);

  const handleToggleFavorites = () => {
    setToggleFavorites(!toggleFavorites);
    setClientSideItems(!toggleFavorites ? favoriteProducts : originalProducts);
  };

  const handleToggleBucketMode = () => setBucketMode(!bucketMode);

  /* Dynamic Display control render based on bucket mode*/
  return (
    <>
      {/* All action modals here */}
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
        <div className="flex justify-between items-center">
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
                  !originalProducts ||
                  originalProducts.length === 0
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
                !originalProducts ||
                originalProducts.length === 0
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
          </div>
        </div>
      ) : (
        <p>Initializing store details...</p>
      )}
    </>
  );
};

export default ProductDisplayControl;
