import { DBSchema, openDB } from "idb";

interface InventoryKey {
  invItem: string;
  invId: number;
}

interface SearchKeysCache extends DBSchema {
  keys: {
    key: string; // store_id as the primary key
    value: {
      search_keys: InventoryKey[];
      store_id: string;
    };
    indexes: { store_id: string };
  };
}

const useBrowserCache = () => {
  // Initialize the IndexedDB store
  const initKeysCache = () =>
    openDB<SearchKeysCache>("keys-cache", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("keys")) {
          const keysStore = db.createObjectStore("keys", {
            keyPath: "store_id",
          });
          keysStore.createIndex("store_id", "store_id");
        }
      },
    });

  // Store data to cache
  const storeToCache = async (
    search_keys: InventoryKey[],
    store_id: string
  ) => {
    const db = await initKeysCache();
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
    const db = await initKeysCache();
    const keyStore = await db.get("keys", store_id);
    return keyStore;
  };

  // Check if cache exists for a store
  const checkCacheForStore = async (store_id: string) => {
    const db = await initKeysCache();
    return (await db.get("keys", store_id)) !== undefined;
  };

  return { getKeysFromCache, storeToCache, checkCacheForStore };
};

export default useBrowserCache;
