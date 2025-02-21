import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

// DELETE: Remove a favorite item
export async function DELETE(req: Request, { params }: { params: { storeid: string; invid: string } }) {
  try {
    const { storeid, invid } = params;

    if (!storeid || !invid) {
      return NextResponse.json({ error: "storeid and invid are required" }, { status: 400 });
    }

    const deletedFavorite = await db.favorites.deleteMany({
      where: { storeid: Number(storeid), invid: Number(invid) },
    });

    if (deletedFavorite.count === 0) {
      return NextResponse.json({ error: "Favorite item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: `Favorite item ${invid} removed successfully` }, { status: 200 });
  } catch (err) {
    console.error("Error deleting favorite:", err);
    return NextResponse.json({ error: "An error occurred while deleting the favorite" }, { status: 500 });
  }
}

// PUT: Update a favorite item
export async function PUT(req: Request, { params }: { params: { storeid: string; invid: string } }) {
  try {
    const body = await req.json();
    const { invitem, invitembrand } = body;
    const { storeid, invid } = params;

    if (!storeid || !invid || !invitem) {
      return NextResponse.json({ error: "storeid, invid, and invitem are required" }, { status: 400 });
    }

    const updatedFavorite = await db.favorites.updateMany({
      where: { storeid: Number(storeid), invid: Number(invid) },
      data: { invitem, invitembrand },
    });

    if (updatedFavorite.count === 0) {
      return NextResponse.json({ error: "Favorite item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: `Favorite item ${invid} updated successfully` }, { status: 200 });
  } catch (err) {
    console.error("Error updating favorite:", err);
    return NextResponse.json({ error: "An error occurred while updating the favorite" }, { status: 500 });
  }
}
