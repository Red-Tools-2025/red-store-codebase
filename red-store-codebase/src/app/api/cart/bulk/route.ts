import {
  ProcessBulkCartRequest,
  ProcessCartRequestBody,
  TimeSeries,
} from "@/app/types/inventory/api";

import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import supabase from "../../../../../supabase/client";

// bulk processing purchases stored in cache
export async function POST(req: Request) {
  try {
    const body: ProcessBulkCartRequest = await req.json();
    const { purchases, store_id, purchase_time } = body;

    if (purchases.length === 0) {
      return NextResponse.json(
        { error: "No purchases to process" },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const timestamp = new Date(purchase_time);
    const allSeriesInserts: TimeSeries[] = [];
    const allInventoryUpdates: Promise<any>[] = [];

    for (const cartItems of purchases) {
      const cart_product_ids = cartItems.map(
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

      const prepped_series_inserts: TimeSeries[] = cartItems.map((cartItem) => {
        const inventoryItem = products_inventory.find(
          (item) => item.invId === cartItem.product_id
        );

        if (!inventoryItem)
          throw new Error(
            `Product with ID ${cartItem.product_id} not found in inventory, please scan again`
          );

        console.log({
          calculations: {
            closing: inventoryItem.invItemStock - cartItem.productQuantity,
            sales: cartItem.productQuantity,
          },
        });

        // Corrected to match API body keys
        const productQuantity = cartItem.productQuantity; // Fix here

        return {
          mrp_per_bottle: inventoryItem.invItemPrice,
          sales: cartItem.productQuantity,
          sale_amount: cartItem.productQuantity * inventoryItem.invItemPrice,
          product_id: cartItem.product_id,
          product_name: inventoryItem.invItem, // Added product_name
          opening_stock: inventoryItem.invItemStock,
          received_stock: 0,
          closing_stock: inventoryItem.invItemStock - productQuantity,
          store_id: store_id,
          time: timestamp.toISOString(),
        };
      });

      // Create the decrements sequentially
      const inventory_updates = cartItems.map((cartItem) =>
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
      allInventoryUpdates.push(...(inventory_updates as Promise<any>[]));
    }

    // insert data into Timeseries table
    const { error: TimeseriesInsertionError } = await supabase
      .from("inventory_timeseries")
      .insert(allSeriesInserts);

    if (TimeseriesInsertionError) {
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
