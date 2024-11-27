// src/hooks/inventory/useProducts.tsx
import { useEffect, useState } from "react";
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
} => {
  const [inventoryItems, setInventoryItems] = useState<Inventory[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get<FetchProductsServerFetch>(
          "/api/inventory/products",
          {
            params: { storeId, storeManagerId },
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
  }, [storeId, storeManagerId]);

  return { inventoryItems, message, error, isLoading };
};

export default useProducts;
