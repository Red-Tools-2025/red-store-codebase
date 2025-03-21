import { usePos } from "@/app/contexts/pos/PosContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { openDB, DBSchema } from "idb";
import { Dispatch, SetStateAction, useState } from "react";

// Define the IndexedDB Schema
interface POSDbBuffer extends DBSchema {
  sales: {
    key: number; // key for a sales log
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
    indexes: { purchase_time: string };
  };
}

const useBrowserCacheStorage = () => {
  const { toast } = useToast();
  const { setCartItems, setClientSideItems, handleResync } = usePos();

  const [isSyncingToInventory, setIsSyncingToInventory] =
    useState<boolean>(false);

  // Initializing the browser DB for object storage
  const initDB = openDB<POSDbBuffer>("pos-buffer", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("sales")) {
        const store = db.createObjectStore("sales", {
          autoIncrement: true,
        });
        store.createIndex("purchase_time", "purchase_time");
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

  const syncToServer = async (store_id: number) => {
    const db = await initDB;
    const sales_records = await db.getAll("sales");
    if (sales_records.length === 0) {
      toast({
        title: "No Sales",
        description: "No sales to sync",
      });
      return;
    }
    setIsSyncingToInventory(true);
    const bulkPayload = sales_records.reduce((acc, record) => {
      const existingRecord = acc.find(
        (r) => r.purchase_time === record.purchase_time
      );

      if (existingRecord) {
        existingRecord.purchases.push(record.cartItem);
      } else {
        acc.push({
          purchases: [record.cartItem],
          purchase_time: record.purchase_time,
        });
      }
      return acc;
    }, [] as { purchases: POSDbBuffer["sales"]["value"]["cartItem"][]; purchase_time: string }[]);

    try {
      const update_response = await axios.post("/api/cart/bulk", {
        sales_records: bulkPayload,
        store_id,
      });

      if (update_response.status === 200) {
        await db.clear("sales");
        handleResync();
        toast({
          title: "Sales Synced",
          description: "Sales synced to server",
        });
      }
    } catch (error) {
      console.error("Error syncing sales to server:", error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync sales to server.",
      });
    } finally {
      setIsSyncingToInventory(false);
    }
  };

  return { saveToCache, syncToServer, isSyncingToInventory };
};

export default useBrowserCacheStorage;
