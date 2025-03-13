import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Adjust the import path based on your project structure
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

    // Fetch all inventory items (no pagination)
    const inventoryItems = await db.inventory.findMany({
      where: {
        storeId: storeId,
        storeManagerId: storeManagerId,
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
