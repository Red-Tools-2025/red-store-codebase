import { InventoryKey } from "@/app/types/inventory/components";
import { DBSchema, openDB } from "idb";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
interface InventoryStoreCache extends DBSchema {
  // search keys cache
  keys: {
    key: string; // store_id as the primary key
    value: {
      search_keys: InventoryKey[];
      store_id: string;
    };
    indexes: { store_id: string };
  };

  // favorite search keys cache store
  favorites: {
    key: string; // store_id as the primary key
    value: {
      favorite_keys: InventoryKey[];
      store_id: string;
      storemanagerid: string;
    };
    indexes: { store_id: string };
  };
}

const useBrowserCache = () => {
  const [fetchingFavorites, setFetchingFavorites] = useState<boolean>(false);
  // Initialize the IndexedDB store
  const initStoreCache = () =>
    openDB<InventoryStoreCache>("inventory-cache", 1, {
      upgrade(db) {
        // facilitating creation of keys cache
        if (!db.objectStoreNames.contains("keys")) {
          const keysStore = db.createObjectStore("keys", {
            keyPath: "store_id",
          });
          keysStore.createIndex("store_id", "store_id");
        }

        // facilitating creation of favorites cache
        if (!db.objectStoreNames.contains("favorites")) {
          const favoriteProducts = db.createObjectStore("favorites", {
            keyPath: "store_id",
          });
          favoriteProducts.createIndex("store_id", "store_id");
        }
      },
    });

  // Store data to cache
  const storeToCache = async (
    search_keys: InventoryKey[],
    store_id: string
  ) => {
    const db = await initStoreCache();
    const existingEntry = await db.get("keys", store_id);

    if (!existingEntry) {
      console.log(`Storing new entry for store_id: ${store_id}`);
      await db.put("keys", { store_id, search_keys });
    } else {
      console.log(`Cache already exists for store_id: ${store_id}, skipping.`);
    }
  };

  // Get specific key from cache
  const getKeysFromCache = async (store_id: string) => {
    const db = await initStoreCache();
    const keyStore = await db.get("keys", store_id);
    return keyStore;
  };

  // Check if cache exists for a store
  const checkCacheForStore = async (store_id: string) => {
    const db = await initStoreCache();
    return (await db.get("keys", store_id)) !== undefined;
  };

  // Store keys to favorites cache
  const storeFavoriteKeyToCache = async (
    favorite_keys: InventoryKey[],
    store_id: string,
    storemanagerid: string
  ) => {
    try {
      const db = await initStoreCache();
      const existingFavorites = await db.get("favorites", store_id);

      console.log(
        "📌 Existing Favorites in Cache BEFORE update:",
        existingFavorites?.favorite_keys
      );
      console.log("📌 Newly Selected Favorites:", favorite_keys);

      const initialFavoriteKeys = existingFavorites?.favorite_keys ?? [];

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

      // ✅ Now update the cache **AFTER** processing API calls
      if (existingFavorites) {
        existingFavorites.favorite_keys = favorite_keys;
        existingFavorites.storemanagerid = storemanagerid;
        await db.put("favorites", existingFavorites);
      } else {
        await db.put("favorites", { store_id, favorite_keys, storemanagerid });
      }

      console.log("📌 Cache updated with new favorites:", favorite_keys);
    } catch (error) {
      console.error(`🚨 Error storing favorite for store ${store_id}:`, error);
    }
  };

  // Remove a favorite key from the cache
  const removeFavoriteKeyFromCache = async (
    favorite_key: InventoryKey, // The key to be removed
    store_id: string
  ) => {
    try {
      const db = await initStoreCache();
      const existingFavorites = await db.get("favorites", store_id);

      if (existingFavorites) {
        // Find the index of the favorite key to remove
        const favoriteIndex = existingFavorites.favorite_keys.findIndex(
          (key) => key.invId === favorite_key.invId
        );

        if (favoriteIndex !== -1) {
          // Remove the key from the favorites array
          existingFavorites.favorite_keys.splice(favoriteIndex, 1);

          // Ensure storemanagerid is retained while updating IndexedDB
          await db.put("favorites", {
            store_id,
            favorite_keys: existingFavorites.favorite_keys,
            storemanagerid: existingFavorites.storemanagerid, // Retain storemanagerid
          });

          console.log(`Favorite product removed for store ${store_id}.`);
        } else {
          console.log(`Product not found in favorites for store ${store_id}.`);
        }
      } else {
        console.log(`No favorites found for store ${store_id}.`);
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
      const db = await initStoreCache();
      let favorites = await db.get("favorites", store_id);

      // If no data is found in the cache, fetch from the API
      if (!favorites) {
        console.log(
          `Cache is empty for store ${store_id}, fetching from API...`
        );
        setFetchingFavorites(true);
        try {
          const response = await axios.get(
            `/api/inventory/products/favorites/${store_id}?storemanagerid=${storemanagerid}`
          );

          if (
            response.data &&
            Array.isArray(response.data.favorite_keys) &&
            response.data.favorite_keys.length > 0
          ) {
            favorites = {
              favorite_keys: response.data.favorite_keys ?? [], // Ensure it's always an array
              storemanagerid: response.data.storemanagerid ?? "", // Ensure it's always a string
              store_id: store_id, // Ensure store_id is included
            };

            // Store the fetched data into IndexedDB for future use
            await db.put("favorites", favorites);
            console.log(`Fetched and stored favorites for store ${store_id}`);
          } else {
            console.log(`No favorites found in API for store ${store_id}`);
            favorites = { favorite_keys: [], storemanagerid: "", store_id }; // Ensure store_id is included
          }
        } catch (error) {
          console.error(`Error fetching favorites from API:`, error);
          favorites = { favorite_keys: [], storemanagerid: "", store_id }; // Ensure store_id is included even in case of error
        } finally {
          setFetchingFavorites(false);
        }
      }

      // Ensure the return object always includes store_id
      return {
        favorite_keys: favorites.favorite_keys ?? [],
        storemanagerid: favorites.storemanagerid ?? "",
        store_id: favorites.store_id ?? store_id, // Ensure store_id is always present
      };
    } catch (error) {
      console.error(`Error fetching favorites for store ${store_id}:`, error);
      return { favorite_keys: [], storemanagerid: "", store_id }; // Ensure store_id is always returned
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

      // Fetch latest data from API
      setFetchingFavorites(true);
      const response = await axios.get(
        `/api/inventory/products/favorites/${store_id}?storemanagerid=${storemanagerid}`
      );

      let favorites;

      if (response.data && Array.isArray(response.data.favorite_keys)) {
        favorites = {
          favorite_keys: response.data.favorite_keys ?? [],
          storemanagerid: response.data.storemanagerid ?? "",
          store_id: store_id,
        };

        // Update cache with fresh API data
        const db = await initStoreCache();
        await db.put("favorites", favorites);

        setSelectedKeys(response.data.favorite_keys ?? []);

        console.log(
          `✅ Cache updated with fresh favorites for store ${store_id}`
        );
      } else {
        console.log(`❌ No valid data received from API for store ${store_id}`);
        favorites = { favorite_keys: [], storemanagerid: "", store_id };
      }
    } catch (error) {
      console.error(`🚨 Error force-fetching favorites from API:`, error);
      return { favorite_keys: [], storemanagerid: "", store_id };
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
