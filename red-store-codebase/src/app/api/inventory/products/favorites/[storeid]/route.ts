// Function to handle the GET request
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Ensure correct path
import { redis } from "@/lib/redis";

export async function GET(
  req: Request,
  { params }: { params: { storeid: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const storemanagerid = searchParams.get("storemanagerid");

    if (!storemanagerid) {
      return NextResponse.json(
        { error: "storemanagerid is required" },
        { status: 400 }
      );
    }

    // Validate first via Cache
    const cache_key = `inv_favs:${Number(params.storeid)}`;
    const fav_prod_ids = await redis.smembers(cache_key);

    // Attempt to fetch via cache first
    if (fav_prod_ids.length > 0) {
      const pipeline = redis.pipeline();
      fav_prod_ids.forEach((p_id) => {
        pipeline.get(`${cache_key}:${p_id}`);
      });

      const results = await pipeline.exec();
      if (results) {
        const products = results
          .map(([err, res]) =>
            typeof res === "string" ? JSON.parse(res) : null
          )
          .filter(Boolean);

        console.log("Favs from cache were retrieved");

        return NextResponse.json(
          { favorite_keys: products, storemanagerid },
          { status: 200 }
        );
      }
    }

    // Fetch all favorites for the store and storemanagerid when cache not populated
    const favorites = await db.favorites.findMany({
      where: {
        storeid: Number(params.storeid),
        storemanagerid: storemanagerid,
      },
    });

    // Convert database field names to camelCase
    const formattedFavorites = favorites.map((fav) => ({
      favId: fav.favid,
      storeId: fav.storeid,
      storemanagerid: fav.storemanagerid,
      invId: fav.invid,
      invItem: fav.invitem,
      invItemBrand: fav.invitembrand,
      addedAt: fav.addedat,
    }));

    // Store to cache
    if (formattedFavorites.length > 0) {
      const pipeline = redis.pipeline();
      formattedFavorites.forEach((fav_item) => {
        const favItemKey = `${cache_key}:${fav_item.invId}`;
        pipeline.set(favItemKey, JSON.stringify(fav_item));
        pipeline.sadd(cache_key, fav_item.invId);
      });
      await pipeline.exec();
      await redis.expire(cache_key, 86400);
    }

    return NextResponse.json(
      { favorite_keys: formattedFavorites, storemanagerid },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching favorites:", err);
    return NextResponse.json(
      { error: "An error occurred while fetching the favorites" },
      { status: 500 }
    );
  }
}
