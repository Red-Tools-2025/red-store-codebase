import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import useBrowserCache from "./useBrowserCache";

interface InventoryKey {
  invItem: string;
  invId: number;
}

interface ProductKeysServerFetch {
  message: string | null;
  inventoryKeys: InventoryKey[];
}

// for fetching search keys to store to cache
const useSearch = (storeId: string, storeManagerId: string) => {
  const { toast } = useToast();
  const { checkCacheForStore, storeToCache } = useBrowserCache();
  const [fetchingKeys, setFetchingKeys] = useState<boolean>(false);
  const [searchKeys, setSearchKeys] = useState<InventoryKey[]>([]);

  useEffect(() => {
    const fetchStoreKeys = async () => {
      try {
        setFetchingKeys(true);
        const { data } = await axios.get<ProductKeysServerFetch>(
          "/api/inventory/products/search",
          {
            params: {
              storeId,
              storeManagerId,
            },
          }
        );

        if (!data.inventoryKeys) {
          toast({
            title: "Error",
            description: "Error getting search keys from sever",
            variant: "destructive",
          });
          return;
        }

        setSearchKeys(data.inventoryKeys);
        setFetchingKeys(false);

        const cacheCheck = await checkCacheForStore(storeId);

        // Add to cache
        if (!cacheCheck) {
          console.log("Storing keys to cache:", data.inventoryKeys);
          await storeToCache(data.inventoryKeys, storeId);
        }

        console.log({ cacheCheck });
      } catch (err) {
        console.log(err);
        setFetchingKeys(false);
      }
    };

    fetchStoreKeys();
  }, [storeId, storeManagerId]);

  return { searchKeys, fetchingKeys };
};

export default useSearch;
