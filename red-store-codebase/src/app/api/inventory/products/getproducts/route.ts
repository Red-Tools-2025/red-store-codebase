import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Adjust the import path based on your project structure
import { redis } from "@/lib/redis";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const storeIdStr = searchParams.get("storeId");
    const storeManagerId = searchParams.get("storeManagerId");

    if (!storeIdStr || !storeManagerId) {
      return NextResponse.json(
        { error: "storeId and storeManagerId are required" },
        { status: 400 }
      );
    }

    // Convert storeId to a number
    const storeId = parseInt(storeIdStr, 10);

    // Define a cache_key for redis store
    const cache_key = `inv_products:${storeId}`;
    const products_count_key = `inv_total_count:${storeId}`;

    // Verify members in cache store before fetch
    const cache_product_ids = await redis.smembers(cache_key);

    // if there are cached products attempt fetch from cache
    if (cache_product_ids.length > 0) {
      // Cache:hit fetch JSON data of each product (via Pipeline)
      const pipeline = redis.pipeline();
      // Transaction method equivalent to *--- Promise.all(redis.hset) ---*
      cache_product_ids.forEach((p_id) => {
        pipeline.get(`${cache_key}:${p_id}`);
      });
      pipeline.get(products_count_key);

      // Execute pipeline on finishing accumilation
      const results = await pipeline.exec();
      if (results) {
        const totalCountResult = results[results.length - 1];

        const products = results
          .map(([err, res]) =>
            typeof res === "string" ? JSON.parse(res) : null
          )
          .filter(Boolean);

        const totalCount =
          typeof totalCountResult[1] === "string"
            ? parseInt(totalCountResult[1], 10)
            : products.length;
        console.log("Data from cache was retrieved");
        return NextResponse.json(
          {
            message: "Data retrieved successfully (from cache)",
            inventoryItems: products,
            total_count: totalCount,
          },
          { status: 200 }
        );
      }
    }

    //  Cache miss — fetch from database
    const inventoryItems = await db.inventory.findMany({
      where: {
        storeId: storeId,
        storeManagerId: storeManagerId,
      },
    });

    // Get total count of inventory items
    const total_count = inventoryItems.length;

    if (total_count === 0) {
      return NextResponse.json(
        {
          message: "No inventory items available for this store.",
          inventoryItems,
        },
        { status: 200 }
      );
    }

    // Send to cache and populate
    const pipeline = redis.pipeline();
    inventoryItems.forEach((item) => {
      const itemKey = `${cache_key}:${item.invId}`;
      pipeline.set(itemKey, JSON.stringify(item));
      pipeline.sadd(cache_key, item.invId);
    });

    pipeline.set(products_count_key, total_count.toString());
    await pipeline.exec();

    console.log("Data from database was retrieved and cached");
    // Return all inventory items
    return NextResponse.json(
      {
        message: "Data retrieved successfully",
        inventoryItems,
        total_count,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.log("Error fetching inventory items for store");
    const errMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json(
      {
        error: `An error occurred while fetching inventory items: ${errMessage}`,
      },
      { status: 500 }
    );
  }
}
