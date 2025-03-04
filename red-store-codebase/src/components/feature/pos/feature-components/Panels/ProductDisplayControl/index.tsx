import { usePos } from "@/app/contexts/pos/PosContext";
import useBrowserCacheStorage from "@/app/hooks/pos/ServerHooks/useBrowserCacheStorage";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { IoIosStar } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import { BsFillBucketFill } from "react-icons/bs";

const ProductDisplayControl = () => {
  const { syncToServer } = useBrowserCacheStorage();
  const {
    selectedStore,
    originalProducts,
    favoriteProducts,
    bucketMode,
    setBucketMode,
    setClientSideItems,
  } = usePos();
  const [toggleFavorites, setToggleFavorites] = useState<boolean>(false);

  const handleToggleFavorites = () => {
    setToggleFavorites(!toggleFavorites);
    setClientSideItems(!toggleFavorites ? favoriteProducts : originalProducts);
  };

  const handleToggleBucketMode = () => setBucketMode(!bucketMode);

  return (
    <>
      {selectedStore && selectedStore.storeId ? (
        <div className="flex gap-2">
          {!bucketMode ? (
            <>
              <Button
                onClick={() => syncToServer(selectedStore.storeId)}
                variant={"secondary"}
              >
                <div className="flex items-center">
                  <RefreshCw className="mr-2 h-3 w-3" />
                  <p>Sync to Inventory</p>
                </div>
              </Button>
              <Button
                onClick={handleToggleFavorites}
                disabled={!favoriteProducts || favoriteProducts.length === 0}
                variant={"secondary"}
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
              </Button>{" "}
            </>
          ) : (
            <>
              <Button
                onClick={handleToggleFavorites}
                disabled={!favoriteProducts || favoriteProducts.length === 0}
                variant={"secondary"}
                className={
                  toggleFavorites
                    ? "bg-yellow-100 border-yellow-700 text-yellow-700"
                    : ""
                }
              >
                <div className="flex items-center">
                  <IoIosAddCircle className="mr-1 h-4 w-4" />
                  <p>Create Bucket</p>
                </div>
              </Button>
            </>
          )}
          <Button
            onClick={handleToggleBucketMode}
            disabled={!favoriteProducts || favoriteProducts.length === 0}
            variant={"secondary"}
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
      ) : (
        <p>Initializing store details...</p>
      )}
    </>
  );
};

export default ProductDisplayControl;
