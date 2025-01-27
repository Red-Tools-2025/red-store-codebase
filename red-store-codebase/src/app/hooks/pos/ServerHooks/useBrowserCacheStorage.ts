import { usePos } from "@/app/contexts/pos/PosContext";
import { useToast } from "@/hooks/use-toast";
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
      store_id: string;
      purchase_time: string;
    };
    indexes: { storeId: string; productId: string };
  };
}

const useBrowserCacheStorage = () => {
  const { toast } = useToast();
  const { setCartItems, setClientSideItems } = usePos();
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
    isSavingToCache: Dispatch<SetStateAction<boolean>>
  ) => {
    const db = await initDB;
    isSavingToCache(true);
    try {
      for (const record of records) {
        await db.add("sales", record); // Ensure each record has a unique `cartItem.product_id`
        // ensures the client side inventory view is updated
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
      setCartItems([]);
      toast({
        title: "Purchase Logged",
        description: `${records.length} sales logged to buffer`,
      });
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

  const syncToServer = async () => {
    const db = await initDB;
    const sales_records = await db.getAll("sales");
  };

  return { saveToCache };
};

export default useBrowserCacheStorage;
