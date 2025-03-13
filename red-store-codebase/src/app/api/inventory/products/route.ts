import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Adjust the import path based on your project structure
import {
  AddInventoryRequestBody,
  DeleteProductRequestBody,
  UpdateProductRequestBody,
} from "@/app/types/inventory/api";

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

      invAdditional,
    } = body;

    // Convert storeId from string to number
    const storeId = parseInt(storeIdStr, 10);

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

    // Ensure the partition exists for the store
    await db.$executeRaw`SELECT check_and_create_inventory_partition(${storeId}::integer);`;

    // check of existing product relies mostly on duplicate barcodes
    const existingProduct = await db.inventory.findFirst({
      where: {
        storeId: storeId,
        invItemBarcode: invItemBarcode,
      },
    });

    if (existingProduct)
      return NextResponse.json(
        {
          message: `Product with barcode : ${existingProduct.invItemBarcode} already exists`,
        },
        { status: 400 }
      );

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
    console.error("Upload Error adding inventory:", err);
    return NextResponse.json(
      {
        error:
          "An error occurred while adding the inventory, Please check your internet",
      },
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

    // pagintaion query params parsing
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "15", 10); // displaying 15 records per page

    const offset = (page - 1) * pageSize;

    if (!storeIdStr || !storeManagerId) {
      return NextResponse.json(
        { error: "storeId and storeManagerId are required" },
        { status: 400 }
      );
    }

    // Convert storeId to a number
    const storeId = parseInt(storeIdStr, 10);

    // for metric purposes, retyrn the total count of inventory items
    const total_count = await db.inventory.count({
      where: { storeId, storeManagerId },
    });

    const inventoryItems = await db.inventory.findMany({
      where: {
        storeId: storeId,
        storeManagerId: storeManagerId,
      },
      skip: offset,
      take: pageSize, // LIMIT and OFFSET
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


/* export async function GET(req: Request) {
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
 */


// Endpoint to delete product from inventory
export async function DELETE(req: Request) {
  try {
    const body: DeleteProductRequestBody = await req.json();
    const { productId, storeId } = body;

    // First locate the product to ensure it exists
    const product = await db.inventory.findFirst({
      where: {
        AND: [{ storeId: storeId }, { invId: productId }],
      },
    });

    console.log("product", product);

    if (!product) {
      return NextResponse.json(
        {
          message: `Product not found`,
        },
        { status: 404 }
      );
    }

    // Then delete using the composite key
    const deleteProduct = await db.inventory.delete({
      where: {
        storeId_invId: {
          storeId: storeId,
          invId: productId,
        },
      },
    });

    return NextResponse.json({
      message: `Removed product: ${deleteProduct.invItem} from stock`,
    });
  } catch (err: unknown) {
    console.log("Error deleting items in inventory, Try again");
    const errMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json(
      {
        error: `An error occurred while deleting inventory item: ${errMessage}`,
      },
      { status: 500 }
    );
  }
}

// Endpoint to update product in inventory
export async function UPDATE(req: Request) {
  try {
    const body: UpdateProductRequestBody = await req.json();
    const { productId, storeId, updates } = body;

    // First locate the product to ensure it exists
    const product = await db.inventory.findFirst({
      where: {
        AND: [{ storeId: storeId }, { invId: productId }],
      },
    });

    console.log("product", product);

    if (!product) {
      return NextResponse.json(
        {
          message: `Product not found`,
        },
        { status: 404 }
      );
    }

    const UpdateProduct = await db.inventory.update({
      where: {
        storeId_invId: {
          storeId: storeId,
          invId: productId,
        },
      },
      data: updates,
    });

    if (!UpdateProduct)
      return NextResponse.json(
        {
          message: `Error during product updation, try again`,
        },
        { status: 400 }
      );

    return NextResponse.json(
      {
        message: `Updated product: ${UpdateProduct.invItem}`,
      },
      { status: 204 }
    );
  } catch (err: unknown) {
    console.log("Error updating item in inventory, Try again");
    const errMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json(
      {
        error: `An error occurred while updating inventory item: ${errMessage}`,
      },
      { status: 500 }
    );
  }
}
