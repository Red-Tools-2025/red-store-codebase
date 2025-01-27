import { Inventory } from "@prisma/client";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface FetchProductsServerFetch {
  message: string | null;
  inventoryItems: Inventory[] | null;
  total_count: number;
}

// hook for syncing operations with the server
const useItems = (
  storeId: string,
  storeManagerId: string,
  setClientSideItems: Dispatch<SetStateAction<Inventory[] | null>>,
  currentPage: number,
  pageSize: number
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resyncInventory, setResyncInventory] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResync = () => {
    setResyncInventory(!resyncInventory);
    setIsLoading(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get<FetchProductsServerFetch>(
          "/api/inventory/products",
          {
            params: {
              storeId,
              storeManagerId,
              page: currentPage,
              pageSize: pageSize,
            },
          }
        );
        if (data.inventoryItems) {
          setClientSideItems(data.inventoryItems);
        }
        setIsLoading(false);
        setMessage(data.message);
      } catch (err) {
        setIsLoading(false);
        console.error("Error fetching data:", err);
        setError("Failed to fetch products");
      }
    };

    fetchData();
  }, [storeId, storeManagerId, resyncInventory, currentPage, pageSize]);

  return {
    handleResync,
    isLoading,
  };
};

export default useItems;
