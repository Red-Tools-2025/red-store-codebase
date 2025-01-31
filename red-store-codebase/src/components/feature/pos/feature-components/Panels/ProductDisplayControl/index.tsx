import { usePos } from "@/app/contexts/pos/PosContext";
import useBrowserCacheStorage from "@/app/hooks/pos/ServerHooks/useBrowserCacheStorage";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { IoIosStar } from "react-icons/io";

interface ProductDisplayControlProps {
  handleRefresh?: () => void;
}

const ProductDisplayControl: React.FC<ProductDisplayControlProps> = ({
  handleRefresh,
}) => {
  const { syncToServer } = useBrowserCacheStorage();
  const {
    selectedStore,
    inventoryItems,
    originalProducts,
    favoriteProducts,
    setClientSideItems,
  } = usePos();
  const [toggleFavorites, setToggleFavorites] = useState<boolean>(false);

  const handleToggleFavorites = () => {
    setToggleFavorites(!toggleFavorites);
    setClientSideItems(!toggleFavorites ? favoriteProducts : originalProducts);
  };

  return (
    <>
      {selectedStore && selectedStore.storeId ? (
        <div className="flex gap-2">
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
          </Button>
        </div>
      ) : (
        <p>Initializing store details...</p>
      )}
    </>
  );
};

export default ProductDisplayControl;
