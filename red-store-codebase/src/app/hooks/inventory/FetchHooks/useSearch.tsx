import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";

interface InventoryKey {
  invItem: string;
  invId: number;
}

interface ProductKeysServerFetch {
  message: string | null;
  inventoryItems: InventoryKey[];
}

// for fetching search keys to store to cache
const useSearch = (storeId: string, storeManagerId: string) => {
  const { toast } = useToast();
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

        if (data.inventoryItems) {
          setSearchKeys(data.inventoryItems);
          setFetchingKeys(false);
        }
      } catch (err) {
        console.log(err);
        setFetchingKeys(false);
        toast({
          title: "Error",
          variant: "destructive",
          description:
            "Unable to initialize your search keys try refreshing the page",
        });
      }
    };

    fetchStoreKeys();
  }, [storeId, storeManagerId]);

  return { searchKeys, fetchingKeys };
};

export default useSearch;
