import { InventoryKey } from "@/app/types/inventory/components";
import { db } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Taking input param as favorite keys
    const body: { favorite_keys: InventoryKey[] } = await req.json();
    const { favorite_keys } = body;

    const storeIdStr = searchParams.get("storeId");
    const storeManagerId = searchParams.get("storeManagerId");

    if (!storeIdStr || !storeManagerId) {
      return NextResponse.json(
        { error: "storeId and storeManagerId are required" },
        { status: 400 }
      );
    }

    const storeId = parseInt(storeIdStr);

    const fav_cache_key = `inv_favs:${storeId}`;
    const fav_product_ids = await redis.smembers(fav_cache_key);

    if (fav_product_ids.length > 0) {
      const pipeline = redis.pipeline();
      fav_product_ids.forEach((p_id) => {
        pipeline.get(`${fav_cache_key}:${p_id}`);
      });

      const results = await pipeline.exec();
      if (results) {
        const products = results
          .map(([err, res]) =>
            typeof res === "string" ? JSON.parse(res) : null
          )
          .filter(Boolean);
        console.log("Favorites from cache was retrieved");
        return NextResponse.json(
          {
            message: "Got your favorite products (from Cache)",
            favorite_products: products,
          },
          { status: 200 }
        );
      }
    }

    const favorite_products = await db.inventory.findMany({
      where: {
        storeId: storeId,
        storeManagerId: storeManagerId,
        invId: { in: favorite_keys.map((keys) => keys.invId) },
      },
    });

    if (!favorite_products.length) {
      return NextResponse.json(
        { message: "No favorite products found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Got your favorite products", favorite_products },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error fetching inventory items for store", err);
    const errMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json(
      {
        error: `An error occurred while getting product names: ${errMessage}`,
      },
      { status: 500 }
    );
  }
}
