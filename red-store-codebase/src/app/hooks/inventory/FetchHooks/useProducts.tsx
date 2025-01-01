// src/hooks/inventory/useProducts.tsx
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { Inventory } from "@prisma/client";

interface FetchProductsServerFetch {
  message: string | null;
  inventoryItems: Inventory[] | null;
  total_count: number;
}

const useProducts = (
  storeId: string,
  storeManagerId: string,
  currentPage: number,
  pageSize: number
): {
  inventoryItems: Inventory[] | null;
  message: string | null;
  error: string | null;
  isLoading: boolean;
  handleRefresh: () => void;
} => {
  const [inventoryItems, setInventoryItems] = useState<Inventory[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshInventory, setRefreshInventory] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = () => {
    setRefreshInventory(!refreshInventory);
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
          setInventoryItems(data.inventoryItems);
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
  }, [storeId, storeManagerId, refreshInventory, currentPage, pageSize]);

  return { inventoryItems, message, error, isLoading, handleRefresh };
};

export default useProducts;
