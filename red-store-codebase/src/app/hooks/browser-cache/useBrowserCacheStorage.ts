import { Toast } from "@/components/ui/toast";
import { openDB, DBSchema } from "idb";
import { Dispatch, SetStateAction } from "react";

// Define the IndexedDB Schema
interface POSDbBuffer extends DBSchema {
  sales: {
    key: string; // Unique ID for each inventory item
    value: {
      cartItem: {
        product_id: number;
        product_current_stock: number;
        product_name: string;
        product_price: number;
        productQuantity: number;
      };
    };
    indexes: { storeId: string; productId: string };
  };
}

const useBrowserCacheStorage = () => {
  // Initializing the browser DB for object storage
  const initDB = openDB<POSDbBuffer>("pos-buffer", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("sales")) {
        const store = db.createObjectStore("sales", {
          keyPath: "id",
        });
        store.createIndex("storeId", "store_id");
        store.createIndex("productId", "product_id");
      }
    },
  });

  // Adding product to browser DB
  const saveToCache = async (
    record: POSDbBuffer["sales"]["value"],
    isSavingToCache: Dispatch<SetStateAction<boolean>>
  ) => {
    const db = await initDB;
    isSavingToCache(true);
    await db.add("sales", record);
    isSavingToCache(false);
    console.log(`Product ${record.cartItem.product_id} saved to IndexedDB.`);
  };

  return { saveToCache };
};

export default useBrowserCacheStorage;
