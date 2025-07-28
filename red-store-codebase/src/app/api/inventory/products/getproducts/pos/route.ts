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
    const fav_cache_key = `inv_favs:${storeId}`;

    // Verify members in cache store before fetch
    const cache_product_ids = await redis.smembers(cache_key);
    const fav_product_ids = await redis.smembers(fav_cache_key);

    // Both members of ids need to be present
    if (cache_product_ids.length > 0 && fav_product_ids.length > 0) {
      // Fetch product keys for those that are not in favs
      const pipeline = redis.pipeline();
      cache_product_ids
        .filter((p_id) => !fav_product_ids.includes(p_id))
        .forEach((p_id) => {
          pipeline.get(`${cache_key}:${p_id}`);
        });

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

    // Fetch all favorites
    const favoriteItems = await db.favorites.findMany({
      where: {
        storeid: storeId,
        storemanagerid: storeManagerId,
      },
    });

    const favoriteKeys = favoriteItems.map((item) => item.invid);

    // Fetch all inventory items (no pagination)
    const inventoryItems = await db.inventory.findMany({
      where: {
        storeId: storeId,
        storeManagerId: storeManagerId,
        invId: {
          notIn: favoriteKeys,
        },
      },
    });

    // Get total count of inventory items
    const total_count = inventoryItems.length;

    if (inventoryItems.length === 0) {
      return NextResponse.json(
        {
          message: "No inventory items available for this store.",
          inventoryItems,
        },
        { status: 200 }
      );
    }

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
