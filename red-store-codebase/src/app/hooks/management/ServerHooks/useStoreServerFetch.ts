import { useState, useEffect } from "react";

interface Store {
  storeName: string;
  storeLocation: string;
  storeManagerId: string;
  storeStatus: boolean;
  createdAt: string;
}

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

        if (res.ok) {
          if (res.status === 204) {
            setData([]);
            setError("No stores available for the specified manager.");
          } else {
            const result = await res.json();
            setData(result.stores);
          }
        } else {
          const errorResponse = await res.json();
          setError(errorResponse.error || "An unknown error occurred.");
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
