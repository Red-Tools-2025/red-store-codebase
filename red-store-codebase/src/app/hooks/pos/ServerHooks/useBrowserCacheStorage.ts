import { useToast } from "@/hooks/use-toast";
import { Inventory } from "@prisma/client";
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
  const { toast } = useToast();
  // Initializing the browser DB for object storage
  const initDB = openDB<POSDbBuffer>("pos-buffer", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("sales")) {
        const store = db.createObjectStore("sales", {
          keyPath: "cartItem.product_id",
        });
        store.createIndex("productId", "cartItem.product_id");
      }
    },
  });

  // Adding product to browser DB
  const saveToCache = async (
    records: POSDbBuffer["sales"]["value"][],
    isSavingToCache: Dispatch<SetStateAction<boolean>>,
    setClientSideItems: Dispatch<SetStateAction<Inventory[] | null>>
  ) => {
    const db = await initDB;
    isSavingToCache(true);
    try {
      for (const record of records) {
        await db.add("sales", record); // Ensure each record has a unique `cartItem.product_id`
        setClientSideItems((prev) =>
          prev
            ? prev.map((item) =>
                item.invId === record.cartItem.product_id
                  ? {
                      ...item,
                      invItemStock:
                        item.invItemStock - record.cartItem.productQuantity,
                    }
                  : item
              )
            : prev
        );
      }
      console.log(`${records.length} sales logged successfully.`);
    } catch (error) {
      console.error("Error saving to cache:", error);
    } finally {
      isSavingToCache(false);
      toast({
        title: "Saved to Buffer",
        description: `${records.length} sales saved to buffer`,
      });
    }
  };

  return { saveToCache };
};

export default useBrowserCacheStorage;
