import { Inventory } from "@prisma/client";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useBrowserCache from "../../inventory/ServerHooks/useBrowserCache";

interface FetchProductsFetchResponse {
  message: string | null;
  inventoryItems: Inventory[] | null;
  total_count: number;
}

interface FavoriteProductsFetchResponse {
  message: string;
  favorite_products: Inventory[] | null;
}

// hook for syncing operations with the server
const useItems = (
  storeId: string,
  storeManagerId: string,
  setClientSideItems: Dispatch<SetStateAction<Inventory[] | null>>,
  currentPage: number,
  pageSize: number
) => {
  const { getFavoritesForStore } = useBrowserCache();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [resyncInventory, setResyncInventory] = useState<boolean>(false);
  const [isFetchingFavorites, setIsFetchingFavorites] =
    useState<boolean>(false);

  const [favoriteProducts, setFavoriteProducts] = useState<Inventory[] | null>(
    []
  );
  const [originalProducts, setOriginalProducts] = useState<Inventory[] | null>(
    []
  );

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
        const { data } = await axios.get<FetchProductsFetchResponse>(
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
          setOriginalProducts(data.inventoryItems);
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
        const favorites = await getFavoritesForStore(storeId);
        if (favorites == null || favorites.length === 0) {
          setFavoriteProducts(null);
          console.log("Nothing to see here bro");
        } else {
          const { data } = await axios.post<FavoriteProductsFetchResponse>(
            "/api/inventory/products/search/favorites",
            { favorite_keys: favorites },
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
  }, [
    storeId,
    storeManagerId,
    currentPage,
    pageSize,
    resyncInventory,
    message,
    error,
  ]);

  return {
    handleResync,
    isLoading,
    favoriteProducts,
    originalProducts,
  };
};

export default useItems;
