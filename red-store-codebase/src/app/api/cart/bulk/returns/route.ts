/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ProcessBulkReturnRequest,
  TimeSeries,
} from "@/app/types/inventory/api";
import { db } from "@/lib/prisma";
import supabase from "@/lib/supabase/client";
import { NextResponse } from "next/server";

// Bulk processing returns stored in cache
export async function POST(req: Request) {
  try {
    const body: ProcessBulkReturnRequest = await req.json();
    const { returns, store_id } = body;

    if (returns.length === 0) {
      return NextResponse.json(
        { error: "No returns to process" },
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

    // Process each return record
    for (const record of returns) {
      // record.item_details contains the inventory details
      // record.return_amt is the amount being returned

      // For the timeseries record, mark returns with negative sales values
      const productQuantity = record.return_amt; // positive number from the request
      const timeseriesRecord: TimeSeries = {
        mrp_per_bottle: record.item_details.invItemPrice,
        sales: -Math.abs(productQuantity), // negative value to indicate a return
        sale_amount:
          -Math.abs(productQuantity) * record.item_details.invItemPrice,
        product_id: record.item_details.invId,
        product_name: record.item_details.invItem,
        opening_stock: record.item_details.invItemStock, // current stock before updating
        received_stock: 0,
        closing_stock: record.item_details.invItemStock + productQuantity, // stock increases due to return
        store_id: store_id,
        time: new Date().toISOString(), // mark with the current timestamp
      };

      allSeriesInserts.push(timeseriesRecord);

      // Update inventory: increment the stock count since the product is returned
      const inventoryUpdate = db.inventory.update({
        where: {
          storeId_invId: {
            storeId: store_id,
            invId: record.item_details.invId,
          },
        },
        data: {
          invItemStock: {
            increment: productQuantity,
          },
        },
      });
      allInventoryUpdates.push(inventoryUpdate);
    }

    // Batch insert timeseries records (using a batch size of 100)
    const batch_size = 100;
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
          { error: TimeseriesInsertionError.message },
          {
            status: 400,
            headers: { "Access-Control-Allow-Origin": "*" },
          }
        );
      }
    }

    // Process all inventory updates concurrently
    await Promise.all(allInventoryUpdates);

    return NextResponse.json(
      { message: "Returns processed successfully" },
      {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (error) {
    console.error("Error processing returns:", error);
    return NextResponse.json(
      { error: "An error occurred while processing returns" },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
