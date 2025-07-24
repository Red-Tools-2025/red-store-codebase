import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { redis } from "@/lib/redis";

// DELETE: Remove a favorite item
export async function DELETE(
  req: Request,
  { params }: { params: { storeid: string; invid: string } }
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

    const storeid = Number(params.storeid);
    const invid = Number(params.invid);

    // Delete from database
    const deletedFavorite = await db.favorites.deleteMany({
      where: {
        storeid: storeid,
        storemanagerid: storemanagerid,
        invid: invid,
      },
    });

    if (deletedFavorite.count === 0) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      );
    }

    // Remove from Redis cache
    const cache_key = `inv_favs:${storeid}`;
    const favItemKey = `${cache_key}:${invid}`;

    await redis.del(favItemKey);
    await redis.srem(cache_key, invid.toString());

    return NextResponse.json(
      { message: "Favorite deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting favorite:", err);
    return NextResponse.json(
      { error: "An error occurred while deleting the favorite" },
      { status: 500 }
    );
  }
}

// PUT: Update a favorite item
export async function PUT(
  req: Request,
  { params }: { params: { storeid: string; invid: string } }
) {
  try {
    const body = await req.json();
    const { invitem, invitembrand } = body;
    const { storeid, invid } = params;

    if (!storeid || !invid || !invitem) {
      return NextResponse.json(
        { error: "storeid, invid, and invitem are required" },
        { status: 400 }
      );
    }

    const updatedFavorite = await db.favorites.updateMany({
      where: { storeid: Number(storeid), invid: Number(invid) },
      data: { invitem, invitembrand },
    });

    if (updatedFavorite.count === 0) {
      return NextResponse.json(
        { error: "Favorite item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `Favorite item ${invid} updated successfully` },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating favorite:", err);
    return NextResponse.json(
      { error: "An error occurred while updating the favorite" },
      { status: 500 }
    );
  }
}
