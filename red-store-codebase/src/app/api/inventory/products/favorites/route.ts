import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Ensure correct path
import { redis } from "@/lib/redis";

// Interface for the request body
interface AddFavoriteRequestBody {
  storeid: number;
  storemanagerid: string;
  invid: number;
  invitem: string;
  invitembrand?: string;
}

// Function to handle the POST request
export async function POST(req: Request) {
  try {
    // Parse request body
    const body: AddFavoriteRequestBody = await req.json();
    const { storeid, storemanagerid, invid, invitem, invitembrand } = body;

    // Validate required fields
    if (!storeid || !storemanagerid || !invid || !invitem) {
      return NextResponse.json(
        { error: "storeid, storemanagerid, invid, and invitem are required" },
        { status: 400 }
      );
    }

    // Ensure partition exists before inserting (if applicable)
    await db.$executeRawUnsafe(
      `SELECT check_and_create_favorites_partition(${storeid})`
    );

    // Insert into favorites table
    const favorite = await db.favorites.create({
      data: {
        storeid,
        storemanagerid,
        invid,
        invitem,
        invitembrand,
        addedat: new Date(),
      },
    });

    // Update Redis cache after successful database insert
    const cache_key = `inv_favs:${storeid}`;
    const formattedFavorite = {
      favId: favorite.favid,
      storeId: favorite.storeid,
      storemanagerid: favorite.storemanagerid,
      invId: favorite.invid,
      invItem: favorite.invitem,
      invItemBrand: favorite.invitembrand,
      addedAt: favorite.addedat,
    };

    const favItemKey = `${cache_key}:${favorite.invid}`;
    await redis.set(favItemKey, JSON.stringify(formattedFavorite));
    await redis.sadd(cache_key, favorite.invid.toString());

    // Return success response
    return NextResponse.json(
      { message: `Item ${favorite.invitem} added to favorites`, favorite },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding favorite:", err);
    return NextResponse.json(
      { error: "An error occurred while adding the favorite" },
      { status: 500 }
    );
  }
}
