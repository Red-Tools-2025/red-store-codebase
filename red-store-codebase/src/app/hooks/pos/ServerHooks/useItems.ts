import { Inventory } from "@prisma/client";
import axios, { AxiosResponse, isAxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useBrowserCache from "../../inventory/ServerHooks/useBrowserCache";
import { useToast } from "@/hooks/use-toast";

interface FetchProductsFetchResponse {
  message: string | null;
  inventoryItems: Inventory[] | null;
}

interface FavoriteProductsFetchResponse {
  message: string;
  favorite_products: Inventory[] | null;
}

// hook for syncing operations with the server
const useItems = (
  storeId: string,
  storeManagerId: string,
  setClientSideItems: Dispatch<SetStateAction<Inventory[] | null>>
) => {
  const { toast } = useToast();
  const { getFavoritesForStore } = useBrowserCache();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [resyncInventory, setResyncInventory] = useState<boolean>(false);
  const [isFetchingFavorites, setIsFetchingFavorites] =
    useState<boolean>(false);

  const [favoriteProducts, setFavoriteProducts] = useState<Inventory[] | null>(
    []
  );

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isReturning, setIsReturning] = useState<boolean>(false);
  const [returnsError, setReturnsError] = useState<string>("");

  const handleResync = () => {
    setResyncInventory(!resyncInventory);
    setIsLoading(true);
  };

  const handleReturns = async (
    returns: { item_details: Inventory; return_amt: number }[],
    store_id: number
  ) => {
    try {
      setIsReturning(true);

      // Send the return request to the backend
      const response: AxiosResponse<{ message: string }> = await axios.post(
        "/api/cart/bulk/returns",
        {
          returns: returns,
          store_id: store_id,
        }
      );

      if (response?.data?.message) {
        toast({
          title: "Returns Processed",
          description: "Returned items have been added back to inventory.",
        });
      }
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        setReturnsError(err.response.data.message);
      } else {
        setReturnsError("Something went wrong while processing returns.");
      }
    } finally {
      setIsReturning(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get<FetchProductsFetchResponse>(
          "/api/inventory/products/getproducts/pos",
          {
            params: {
              storeId,
              storeManagerId,
            },
          }
        );
        if (data.inventoryItems) {
          setClientSideItems(data.inventoryItems);
          setMessage(data.message);
        }
        setIsLoading(false);
        setMessage(data.message);
      } catch (err) {
        setIsLoading(false);
        console.error("Error fetching data:", err);
        setError("Failed to fetch products");
      }
    };

    const fetchFavorites = async () => {
      try {
        setIsFetchingFavorites(true);
        const favorites = await getFavoritesForStore(storeId, storeManagerId);
        if (favorites == null || favorites.favorite_keys.length === 0) {
          setFavoriteProducts(null);
          console.log("Nothing to see here bro");
        } else {
          const { data } = await axios.post<FavoriteProductsFetchResponse>(
            "/api/inventory/products/search/favorites",
            { favorite_keys: favorites.favorite_keys },
            {
              params: {
                storeId,
                storeManagerId,
              },
            }
          );
          console.log({ data });
          if (data.favorite_products) {
            setFavoriteProducts(data.favorite_products);
            setIsFetchingFavorites(false);
          }
        }
      } catch (err) {
        setIsFetchingFavorites(false);
        console.log(err);
      }
    };

    fetchData();
    fetchFavorites();
  }, [storeId, storeManagerId, resyncInventory, message, error]);

  return {
    handleResync,
    handleReturns,
    setFavoriteProducts,
    isReturning,
    returnsError,
    isLoading,
    favoriteProducts,
    isFetchingFavorites,
  };
};

export default useItems;
