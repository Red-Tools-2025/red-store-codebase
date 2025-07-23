import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  AddBatchRequestBody,
  DeleteProductBatchRequestBody,
  TimeSeries,
  UpdateProductBatchRequestBody,
} from "@/app/types/inventory/api";
import supabase from "@/lib/supabase/client";
import { redis } from "@/lib/redis";

// batch addition upload to inventory
export async function POST(req: Request) {
  try {
    const body: AddBatchRequestBody = await req.json();
    const { products, storeId: storeIdStr, storeManagerId } = await body;

    // Validate input, no empty arrays
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: 'items' should be a non-empty array." },
        { status: 400 }
      );
    }

    // Convert storeId from string to number
    const storeId = parseInt(storeIdStr, 10);

    //check for availability of store or partition
    const store = await db.store.findFirst({
      where: {
        storeManagerId: storeManagerId,
        storeId: storeId,
      },
    });

    if (!store)
      return NextResponse.json(
        { error: "Couldn't find your store" },
        { status: 400 }
      );

    // enable feature on UI, if inventory is initialized
    const bulkData = products.map((product) => ({
      ...product,
      storeId,
      storeManagerId,
    }));

    const bulkProductAdd = await db.inventory.createMany({
      data: bulkData,
      skipDuplicates: true,
    });

    if (!bulkProductAdd)
      return NextResponse.json(
        {
          error: "Couldn't process your bulk insert request, please try again",
        },
        { status: 400 }
      );

    return NextResponse.json(
      {
        message: `Processed Batch, ${bulkProductAdd.count} products to inventory`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Batch Upload Error in inventory:", err);
    return NextResponse.json(
      { error: "Batch upload error in inventory, Please check your internet" },
      { status: 500 }
    );
  }
}

// Endpoint to batch delete product from inventory
export async function DELETE(req: Request) {
  try {
    const body: DeleteProductBatchRequestBody = await req.json();
    const { productBatch } = body;
    const cache_key = `inv_products:${productBatch[0].storeId}`;

    if (!Array.isArray(productBatch) || productBatch.length === 0) {
      return NextResponse.json(
        {
          error: "Invalid request: 'productBatch' should be a non-empty array.",
        },
        { status: 400 }
      );
    }

    // Extract storeId and invId pairs
    const idsToDelete = productBatch.map((item) => ({
      storeId: item.storeId,
      invId: item.productId,
    }));

    // Validate existence of products before removal, through composite key
    const existingProducts = await db.inventory.findMany({
      where: {
        OR: idsToDelete.map(({ storeId, invId }) => ({ storeId, invId })),
      },
    });

    if (existingProducts.length === 0) {
      return NextResponse.json(
        { error: "No matching products found for deletion." },
        { status: 404 }
      );
    }

    // Perform batch delete using composite key logic
    const deleteResult = await db.inventory.deleteMany({
      where: {
        OR: idsToDelete.map(({ storeId, invId }) => ({
          storeId,
          invId,
        })),
      },
    });

    console.log("Removed from DB");

    // Deleting from cache store
    const delete_pipeline = redis.pipeline();
    idsToDelete.forEach(({ invId }) => {
      const item_key = `${cache_key}:${invId}`;
      delete_pipeline.srem(cache_key, invId);
      delete_pipeline.del(item_key);
    });

    await delete_pipeline.exec();
    console.log("Removed from cache store");

    return NextResponse.json({
      message: `${deleteResult.count} products removed from inventory successfully.`,
    });
  } catch (err: unknown) {
    console.error("Error deleting items in inventory:", err);
    const errMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json(
      {
        error: `An error occurred while deleting inventory items: ${errMessage}`,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body: UpdateProductBatchRequestBody = await req.json();
    const { productBatch } = body;
    const cache_key = `inv_products:${productBatch[0].storeId}`;

    const idsToUpdate = productBatch.map((p) => ({
      storeId: p.storeId,
      invId: p.productId,
    }));

    // Validate existence of products before removal, through composite key
    const existingProducts = await db.inventory.findMany({
      where: {
        OR: idsToUpdate.map(({ storeId, invId }) => ({ storeId, invId })),
      },
    });

    if (existingProducts.length !== productBatch.length) {
      return NextResponse.json(
        { error: "Some products do not exist in the inventory." },
        { status: 404 }
      );
    }

    // Perform individual updates for each product
    const updatePromises = productBatch.map((product) =>
      db.inventory.update({
        where: {
          storeId_invId: {
            storeId: product.storeId,
            invId: product.productId,
          },
        },
        data: {
          invItemStock: {
            increment: product.recievedStock,
          },
        },
      })
    );

    // post updates you will also need to record the restock in sales
    const prepped_series_inserts: TimeSeries[] = productBatch.map(
      (restockItem) => {
        const inventoryItem = existingProducts.find(
          (item) => item.invId === restockItem.productId
        );

        if (!inventoryItem)
          throw new Error(
            `Product with ID ${restockItem.productId} not found in inventory, please scan again`
          );

        return {
          product_id: restockItem.productId,
          product_name: inventoryItem.invItem,
          store_id: restockItem.storeId,
          opening_stock: inventoryItem.invItemStock,
          received_stock: restockItem.recievedStock,
          closing_stock:
            inventoryItem?.invItemStock + restockItem.recievedStock,
          mrp_per_bottle: inventoryItem.invItemPrice,
          sale_amount: 0,
          sales: 0,
          time: new Date().toISOString(),
        };
      }
    );

    const { error: TimeseriesInsertionError } = await supabase
      .from("inventory_timeseries")
      .insert(prepped_series_inserts);

    if (TimeseriesInsertionError) {
      return NextResponse.json(
        { error: TimeseriesInsertionError.message },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Update processing to be done post sales logging to avoid inconsistencies in opening and closing amounts
    const updatedProducts = await db.$transaction(updatePromises);

    console.log("Updated In DB");

    // Updating in cache store
    const update_pipeline = redis.pipeline();
    updatedProducts.forEach((item) => {
      const item_key = `${cache_key}:${item.invId}`;
      // Reparse and set updated product to cache (Set remains the same)
      update_pipeline.set(item_key, JSON.stringify(item));
    });

    await update_pipeline.exec();

    console.log("Updated in Cache");

    return NextResponse.json({
      message: "Products updated successfully",
      updatedProducts,
    });
  } catch (err) {
    console.error("Error updating items in inventory:", err);
    const errMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json(
      {
        error: `An error occurred while updating inventory items: ${errMessage}`,
      },
      { status: 500 }
    );
  }
}
