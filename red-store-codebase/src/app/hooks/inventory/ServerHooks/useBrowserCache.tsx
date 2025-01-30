import { DBSchema, openDB } from "idb";

interface SearchKeysCache extends DBSchema {
  keys: {
    key: number;
    value: {
      search_keys: {
        invItem: string;
        invId: number;
      }[];
      store_id: string;
    };
    indexes: {
      store_id: number;
    };
  };
}

const useBrowserCache = () => {
  // initialize the cache store
  const initKeysCache = openDB<SearchKeysCache>("keys-cache", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("keys")) {
        const keys_store = db.createObjectStore("keys", {
          autoIncrement: true,
        });
        keys_store.createIndex("store_id", "store_id");
      }
    },
  });

  // function to store to cache
  const storeToCache = async (
    search_keys: { invItem: string; invId: number }[],
    store_id
  ) => {
    const db = await initKeysCache;
    await db.add("keys", { store_id, search_keys });
  };

  // get key from cache
  const getKeyFromCache = async (invId: number, store_id: number) => {
    const db = await initKeysCache;
    const key_store = await db.get("keys", store_id);
    if (!key_store) return null;
    const search_key = await key_store.search_keys.find(
      (key) => key.invId === invId
    );
    return key_store || null;
  };

  return { getKeyFromCache, storeToCache };
};

export default useBrowserCache;
