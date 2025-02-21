// Function to handle the GET request
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Ensure correct path
export async function GET(req: Request, { params }: { params: { storeid: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const storemanagerid = searchParams.get("storemanagerid");

    if (!storemanagerid) {
      return NextResponse.json(
        { error: "storemanagerid is required" },
        { status: 400 }
      );
    }

    // Fetch all favorites for the store and storemanagerid
    const favorites = await db.favorites.findMany({
      where: {
        storeid: Number(params.storeid),
        storemanagerid: storemanagerid,
      },
    });

    // Convert database field names to camelCase
    const formattedFavorites = favorites.map(fav => ({
      favId: fav.favid, // Optional: If you want to rename favid to favId
      storeId: fav.storeid, // Optional: If you want to rename storeid to storeId
      storemanagerid: fav.storemanagerid,
      invId: fav.invid,
      invItem: fav.invitem, // Changing from `invitem` to `invItem`
      invItemBrand: fav.invitembrand,
      addedAt: fav.addedat, // Optional: If you want to rename addedat to addedAt
    }));

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
