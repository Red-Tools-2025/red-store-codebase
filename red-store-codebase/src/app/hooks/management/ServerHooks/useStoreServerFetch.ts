import { Store } from "@prisma/client";
import { useState, useEffect } from "react";

interface FetchStoresResult {
  data: Store[] | null;
  isLoading: boolean;
  error: string | null;
}

const useStoreServerFetch = (
  storeManagerID: string | null
): FetchStoresResult => {
  const [data, setData] = useState<Store[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeManagerID) return;

    const fetchStores = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/management/stores?storeManagerID=${storeManagerID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await res.json(); // Parse the response once

        if (res.ok) {
          if (result.stores_for_manager) {
            setData(result.stores_for_manager); // Use the correct property from the response
          }
        } else {
          setError(result.error || "An unknown error occurred.");
        }
      } catch (err) {
        setError("Network error: Failed to fetch stores.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, [storeManagerID]);

  return { data, isLoading, error };
};

export default useStoreServerFetch;
