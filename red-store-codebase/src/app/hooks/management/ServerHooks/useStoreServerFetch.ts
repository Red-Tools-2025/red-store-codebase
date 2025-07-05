import axios, { AxiosError } from "axios";
import { Store } from "@prisma/client";
import { useState, useEffect } from "react";

interface FetchStoresResult {
  data: Store[] | null;
  isLoading: boolean;
  error: string | null;
  handleRefresh: () => void;
}

interface StoresResponse {
  stores_for_manager: Store[]; // Adjust this according to your actual response structure
}

const useStoreServerFetch = (
  storeManagerID: string | null
): FetchStoresResult => {
  const [data, setData] = useState<Store[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [refreshBool, setRefreshBool] = useState(false);

  const handleRefresh = () => {
    setRefreshBool(!refreshBool);
  };

  useEffect(() => {
    if (!storeManagerID) return;

    const fetchStores = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await axios.get<StoresResponse>(`/api/management/stores`, {
          params: { storeManagerID },
          headers: { "Content-Type": "application/json" },
        });

        if (res.data.stores_for_manager) {
          setData(res.data.stores_for_manager);
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, [storeManagerID, refreshBool]);

  return { data, isLoading, error, handleRefresh };
};

export default useStoreServerFetch;
