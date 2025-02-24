/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProcessBulkCartRequest, TimeSeries } from "@/app/types/inventory/api";

import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import supabase from "../../../../lib/supabase/client";

// bulk processing purchases stored in cache
export async function POST(req: Request) {
  try {
    const body: ProcessBulkCartRequest = await req.json();
    const { sales_records, store_id } = body;

    if (sales_records.length === 0) {
      return NextResponse.json(
        { error: "No sales to process" },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const allSeriesInserts: TimeSeries[] = [];
    const allInventoryUpdates: Promise<any>[] = [];

    for (const record of sales_records) {
      const cart_product_ids = record.purchases.map(
        (cartItems) => cartItems.product_id
      );
      const products_inventory = await db.inventory.findMany({
        where: {
          storeId: store_id,
          invId: { in: cart_product_ids },
        },
      });

      if (products_inventory.length === 0)
        return NextResponse.json(
          {
            error: `No matching products found in inventory for one of the purchases`,
          },
          {
            status: 404,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          }
        );

      const prepped_series_inserts: TimeSeries[] = record.purchases.map(
        (cartItem) => {
          const inventoryItem = products_inventory.find(
            (item) => item.invId === cartItem.product_id
          );

          if (!inventoryItem)
            throw new Error(
              `Product with ID ${cartItem.product_id} not found in inventory, please scan again`
            );

          // Corrected to match API body keys
          const productQuantity = cartItem.productQuantity; // Fix here

          return {
            mrp_per_bottle: inventoryItem.invItemPrice,
            sales: cartItem.productQuantity,
            sale_amount: cartItem.productQuantity * inventoryItem.invItemPrice,
            product_id: cartItem.product_id,
            product_name: inventoryItem.invItem, // Added product_name
            opening_stock: cartItem.product_current_stock, // Fix here, due to nature of cache
            received_stock: 0,
            closing_stock: inventoryItem.invItemStock - productQuantity,
            store_id: store_id,
            time: record.purchase_time,
          };
        }
      );

      // Create the decrements sequentially
      const inventory_updates = record.purchases.map((cartItem) =>
        db.inventory.update({
          where: {
            storeId_invId: { storeId: store_id, invId: cartItem.product_id }, // utilizing the primary key
          },
          data: {
            invItemStock: {
              decrement: cartItem.productQuantity,
            },
          },
        })
      );

      allSeriesInserts.push(...prepped_series_inserts);
      allInventoryUpdates.push(...inventory_updates);
    }

    // Creating batchwise bulk insertions
    const batch_size = 100;

    // sequntially loop through and insert in batches
    for (let i = 0; i < allSeriesInserts.length; i += batch_size) {
      const batch = allSeriesInserts.slice(i, i + batch_size);
      const { error: TimeseriesInsertionError } = await supabase
        .from("inventory_timeseries")
        .insert(batch);

      if (TimeseriesInsertionError) {
        console.error("Batch insertion error", {
          batch,
          error: TimeseriesInsertionError,
        });
        return NextResponse.json(
          {
            error: TimeseriesInsertionError.message,
          },
          {
            status: 400,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
    }

    // Process the updates to the inventory
    await Promise.all(allInventoryUpdates);

    return NextResponse.json(
      {
        message: "Sync with backend successful",
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.log("Error processing cart:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the carts" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
