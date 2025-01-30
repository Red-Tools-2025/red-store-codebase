import { InventoryKey } from "@/app/types/inventory/components";
import { DBSchema, openDB } from "idb";

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
    };
    indexes: { store_id: string };
  };
}

const useBrowserCache = () => {
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
    favorite_keys: InventoryKey[], // Expecting an array of favorite keys now
    store_id: string
  ) => {
    try {
      const db = await initStoreCache();
      const existingFavorites = await db.get("favorites", store_id);

      if (existingFavorites) {
        // Check if the products already exist in the favorites
        const existingFavoriteIds = existingFavorites.favorite_keys.map(
          (key) => key.invId
        );

        // Add only the keys that are not already in the favorites
        const newFavoriteKeys = favorite_keys.filter(
          (key) => !existingFavoriteIds.includes(key.invId)
        );

        if (newFavoriteKeys.length > 0) {
          // Add the new favorites to the existing list
          existingFavorites.favorite_keys.push(...newFavoriteKeys);
          await db.put("favorites", {
            store_id,
            favorite_keys: existingFavorites.favorite_keys,
          });
          console.log(`New favorite products added for store ${store_id}.`);
        } else {
          console.log(
            `No new favorites to add for store ${store_id}, skipping.`
          );
        }
      } else {
        // If no favorites exist, create a new list with the provided favorite products
        await db.put("favorites", { store_id, favorite_keys });
        console.log(`First favorite products added for store ${store_id}.`);
      }
    } catch (error) {
      console.error(`Error storing favorite for store ${store_id}:`, error);
      throw error;
    }
  };

  // Get favorites for a specific store
  const getFavoritesForStore = async (store_id: string) => {
    try {
      const db = await initStoreCache();
      const favorites = await db.get("favorites", store_id);
      return favorites?.favorite_keys;
    } catch (error) {
      console.error(`Error fetching favorites for store ${store_id}:`, error);
      return null;
    }
  };

  return {
    getKeysFromCache,
    storeToCache,
    checkCacheForStore,
    getFavoritesForStore,
    storeFavoriteKeyToCache,
  };
};

export default useBrowserCache;
