import { InventoryKey } from "@/app/types/inventory/components";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";

const useBrowserCache = () => {
  const [fetchingFavorites, setFetchingFavorites] = useState<boolean>(false);

  // Store data to cache
  const storeToCache = async (
    search_keys: InventoryKey[],
    store_id: string
  ) => {
    try {
      console.log(`Storing new entry for store_id: ${store_id}`);
      await axios.post(`/api/inventory/keys/${store_id}`, { search_keys });
    } catch (error) {
      console.error(`Error caching search keys for store ${store_id}:`, error);
    }
  };

  // Get specific key from cache
  const getKeysFromCache = async (store_id: string) => {
    try {
      const response = await axios.get(`/api/inventory/keys/${store_id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching keys from cache for store ${store_id}:`,
        error
      );
      return null;
    }
  };

  // Check if cache exists for a store
  const checkCacheForStore = async (store_id: string) => {
    try {
      const result = await getKeysFromCache(store_id);
      return result !== null && result.search_keys?.length > 0;
    } catch (error) {
      console.error(`Error checking cache for store ${store_id}:`, error);
      return false;
    }
  };

  // Store keys to favorites cache
  const storeFavoriteKeyToCache = async (
    favorite_keys: InventoryKey[],
    store_id: string,
    storemanagerid: string
  ) => {
    try {
      const currentFavorites = await getFavoritesForStore(
        store_id,
        storemanagerid
      );
      const initialFavoriteKeys = currentFavorites?.favorite_keys ?? [];

      console.log(
        "📌 Existing Favorites in Cache BEFORE update:",
        initialFavoriteKeys
      );
      console.log("📌 Newly Selected Favorites:", favorite_keys);

      // ✅ Detect newly added and removed favorites BEFORE updating cache
      const newFavorites = favorite_keys.filter(
        (fav) =>
          !initialFavoriteKeys.some((existing) => existing.invId === fav.invId)
      );

      const removedFavorites = initialFavoriteKeys.filter(
        (fav) => !favorite_keys.some((selected) => selected.invId === fav.invId)
      );

      console.log("🆕 New Favorites to be posted:", newFavorites);
      console.log("❌ Removed Favorites to be deleted:", removedFavorites);

      const storeidNumber = Number(store_id);

      // ✅ DELETE: Remove deleted favorites (Newly added logic, now before updating cache)
      for (const favorite of removedFavorites) {
        console.log(`🗑️ Deleting favorite from API: ${favorite.invId}`);

        try {
          const response = await axios.delete(
            `/api/inventory/products/favorites/${storeidNumber}/${favorite.invId}?storemanagerid=${storemanagerid}`
          );

          if (response.status === 200) {
            console.log(
              `✅ Favorite item ${favorite.invId} deleted successfully.`
            );
          } else {
            console.log(`❌ API responded but deletion failed.`);
          }
        } catch (error) {
          console.error(`🚨 Error deleting favorite ${favorite.invId}:`, error);
        }
      }

      // ✅ POST: Add new favorites (Existing logic, still unchanged)
      for (const favorite of newFavorites) {
        const payload = {
          storeid: storeidNumber,
          storemanagerid,
          invid: favorite.invId,
          invitem: favorite.invItem,
          invitembrand: favorite.invItemBrand ?? null,
          addedat: new Date().toISOString(),
        };

        console.log("🚀 Sending payload to API:", payload);

        try {
          const response = await axios.post(
            "/api/inventory/products/favorites",
            payload
          );

          if (response.status === 201) {
            console.log(
              `✅ Favorite item added to the database:`,
              response.data
            );
          } else {
            console.log(
              `❌ API responded but item was not added successfully.`
            );
          }
        } catch (error) {
          console.error("🚨 API Request Failed:", error);
        }
      }

      console.log("📌 Cache updated with new favorites:", favorite_keys);
    } catch (error) {
      console.error(`🚨 Error storing favorite for store ${store_id}:`, error);
    }
  };

  // Remove a favorite key from the cache
  const removeFavoriteKeyFromCache = async (
    favorite_key: InventoryKey,
    store_id: string,
    storemanagerid: string
  ) => {
    try {
      const storeidNumber = Number(store_id);

      const response = await axios.delete(
        `/api/inventory/products/favorites/${storeidNumber}/${favorite_key.invId}?storemanagerid=${storemanagerid}`
      );

      if (response.status === 200) {
        console.log(`Favorite product removed for store ${store_id}.`);
      } else {
        console.log(`Product not found in favorites for store ${store_id}.`);
      }
    } catch (error) {
      console.error(`Error removing favorite for store ${store_id}:`, error);
      throw error;
    }
  };

  // Get favorites for a specific store
  const getFavoritesForStore = async (
    store_id: string,
    storemanagerid: string
  ) => {
    try {
      const response = await axios.get(
        `/api/inventory/products/favorites/${store_id}?storemanagerid=${storemanagerid}`
      );

      const favorite_keys = Array.isArray(response.data?.favorite_keys)
        ? response.data.favorite_keys
        : [];

      const storemanageridFromResponse = response.data?.storemanagerid ?? "";

      return {
        favorite_keys,
        storemanagerid: storemanageridFromResponse,
        store_id,
      };
    } catch (error) {
      console.error(`Error fetching favorites from API:`, error);
      return { favorite_keys: [], storemanagerid: "", store_id };
    }
  };

  // Force refresh: Fetch fresh favorites from the API and update the cache
  const refreshFavoritesForStore = async (
    store_id: string,
    storemanagerid: string,
    setSelectedKeys: Dispatch<SetStateAction<InventoryKey[]>>
  ) => {
    try {
      console.log(
        `🔄 Force fetching favorites from API for store ${store_id}...`
      );

      setFetchingFavorites(true);
      const response = await axios.get(
        `/api/inventory/products/favorites/${store_id}?storemanagerid=${storemanagerid}`
      );

      if (response.data && Array.isArray(response.data.favorite_keys)) {
        setSelectedKeys(response.data.favorite_keys);
        console.log(
          `✅ Fetched and updated favorite keys for store ${store_id}`
        );
      } else {
        setSelectedKeys([]);
        console.warn(
          `⚠️ No valid data received from API for store ${store_id}`
        );
      }
    } catch (error) {
      console.error(`🚨 Error force-fetching favorites from API:`, error);
      setSelectedKeys([]);
    } finally {
      setFetchingFavorites(false);
    }
  };

  return {
    getKeysFromCache,
    storeToCache,
    checkCacheForStore,
    getFavoritesForStore,
    storeFavoriteKeyToCache,
    removeFavoriteKeyFromCache,
    refreshFavoritesForStore,
    fetchingFavorites,
  };
};

export default useBrowserCache;
