/* // src/hooks/inventory/useProducts.tsx
import { useEffect, useState } from "react";
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
  total_count: number;
  handleRefresh: () => void;
} => {
  const [inventoryItems, setInventoryItems] = useState<Inventory[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshInventory, setRefreshInventory] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [total_count, setTotalCount] = useState<number>(0);

  const handleRefresh = () => {
    setRefreshInventory(!refreshInventory);
  };

  useEffect(() => {
    // for fetching paginated data
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
          setTotalCount(data.total_count);
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

  return {
    inventoryItems,
    message,
    error,
    isLoading,
    total_count,
    handleRefresh,
  };
};

export default useProducts; */
// src/hooks/inventory/useProducts.tsx
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Inventory } from "@prisma/client";

interface FetchProductsServerFetch {
  message: string | null;
  inventoryItems: Inventory[] | null;
}

const useProducts = (
  storeId: string,
  storeManagerId: string
): {
  inventoryItems: Inventory[] | null;
  message: string | null;
  error: string | null;
  isLoading: boolean;
  total_count: number;
  handleRefresh: () => void;
} => {
  const [inventoryItems, setInventoryItems] = useState<Inventory[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0); // Used to trigger re-fetching
  const [total_count, setTotalCount] = useState<number>(0);

  // Function to fetch inventory items
  const fetchInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get<FetchProductsServerFetch>(
        "/api/inventory/products/getproducts",
        { params: { storeId, storeManagerId } }
      );
      setInventoryItems(data.inventoryItems || []);
      setTotalCount(data.inventoryItems ? data.inventoryItems.length : 0);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("Error fetching data:", err);
      setError("Failed to fetch products");
    }
  }, [storeId, storeManagerId]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory, refreshKey]);

  // Function to manually trigger re-fetch
  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  return {
    inventoryItems,
    message: null,
    error,
    isLoading,
    total_count,
    handleRefresh,
  };
};

export default useProducts;

