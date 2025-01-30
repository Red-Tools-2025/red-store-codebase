import { usePos } from "@/app/contexts/pos/PosContext";
import useBrowserCacheStorage from "@/app/hooks/pos/ServerHooks/useBrowserCacheStorage";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ProductDisplayControlProps {
  handleRefresh?: () => void;
}

const ProductDisplayControl: React.FC<ProductDisplayControlProps> = ({
  handleRefresh,
}) => {
  const { syncToServer } = useBrowserCacheStorage();
  const { selectedStore } = usePos();
  return (
    <>
      {selectedStore && selectedStore.storeId ? (
        <div>
          <Button
            onClick={() => syncToServer(selectedStore.storeId)}
            variant={"secondary"}
          >
            <div className="flex items-center">
              <RefreshCw className="mr-2 h-3 w-3" />
              <p>Sync to Inventory</p>
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
