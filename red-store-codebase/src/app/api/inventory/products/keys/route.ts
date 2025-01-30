import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

    const storeId = parseInt(storeIdStr);

    const inventoryKeys = await db.inventory.findMany({
      where: {
        storeId: storeId,
        storeManagerId: storeManagerId,
      },
      select: {
        invId: true,
        invItem: true,
      },
    });

    if (inventoryKeys.length === 0) {
      return NextResponse.json(
        {
          message: "No inventory items available for this store.",
          inventoryKeys,
        },
        { status: 200 }
      );
    }

    // Return the inventory items if found
    return NextResponse.json(
      {
        message: "Keys retrieved & stored to cache",
        inventoryKeys,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.log("Error fetching inventory items for store");
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
