import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Adjust the import path based on your project structure

// Interface for the incoming request body for adding inventory
interface AddInventoryRequestBody {
  storeId: string; // Store ID received as a string
  storeManagerId: string; // Assuming this is a user ID
  invItem: string;
  invItemBrand: string;
  invItemStock: number;
  invItemPrice: number;
  invItemType: string;
  invItemBarcode: number;
  invItemSize: number;
  invAdditional?: any; // Optional additional information
}

// Function to handle the POST request for adding inventory
export async function POST(req: Request) {
  try {
    // Parse the body of the request
    const body: AddInventoryRequestBody = await req.json();
    const {
      storeId: storeIdStr,
      storeManagerId,
      invItem,
      invItemBrand,
      invItemStock,
      invItemPrice,
      invItemType,
      invItemBarcode,
      invItemSize,
      invAdditional,
    } = body;

    // Convert storeId from string to number
    const storeId = parseInt(storeIdStr, 10);

    console.log({ body });

    // Validate required fields
    if (
      !storeId ||
      !storeManagerId ||
      !invItem ||
      invItemStock < 0 ||
      invItemPrice < 0
    ) {
      return NextResponse.json(
        { error: "Required fields are missing or invalid." },
        { status: 400 }
      );
    }

    const store = await db.store.findFirst({
      where: {
        storeManagerId: storeManagerId,
        storeId: storeId,
      },
    });

    if (!store)
      return NextResponse.json(
        { error: "Couldn't find your store" },
        { status: 400 }
      );

    console.log("found store", store);

    // Ensure the partition exists for the store
    await db.$executeRaw`SELECT check_and_create_inventory_partition(${storeId}::integer);`;

    // Create a new inventory record
    const inventory = await db.inventory.create({
      data: {
        storeId,
        storeManagerId,
        invItem,
        invItemBrand,
        invItemStock,
        invItemPrice,
        invItemType,
        invItemBarcode,
        invItemSize,
        invAdditional,
        invCreatedDate: new Date(), // Automatically set the created timestamp
      },
    });

    // Return the newly created inventory data
    return NextResponse.json(
      {
        message: `Inventory item ${inventory.invItem} added successfully`,
        inventory,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding inventory:", err);
    return NextResponse.json(
      { error: "An error occurred while adding the inventory" },
      { status: 500 }
    );
  }
}

// Function to handle the GET request for fetching inventory
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

    const inventoryItems = await db.inventory.findMany({
      where: {
        storeId: storeId,
        storeManagerId: storeManagerId,
      },
    });

    if (inventoryItems.length === 0) {
      return NextResponse.json(
        {
          message: "No inventory items available for this store.",
          inventoryItems,
        },
        { status: 200 }
      );
    }

    // Return the inventory items if found
    return NextResponse.json(
      {
        message: "Data retrieved successfully",
        inventoryItems,
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
