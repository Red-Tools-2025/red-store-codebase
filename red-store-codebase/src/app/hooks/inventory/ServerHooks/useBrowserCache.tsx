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
    favorite_keys: InventoryKey[],
    store_id: string
  ) => {
    const db = await initStoreCache();
    await db.put("favorites", { store_id, favorite_keys });
    console.log(`Favorite items for store ${store_id} stored.`);
  };

  // Get favorites for a specific store
  const getFavoritesForStore = async (store_id: string) => {
    const db = await initStoreCache();
    const favorites = await db.getAllFromIndex("favorites", "store_id");
    return favorites;
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
