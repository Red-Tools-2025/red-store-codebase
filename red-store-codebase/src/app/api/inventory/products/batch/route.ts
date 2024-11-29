import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  AddBatchRequestBody,
  DeleteProductBatchRequestBody,
  UpdateProductBatchRequestBody,
} from "@/app/types/inventory/api";

// batch addition upload to inventory
export async function POST(req: Request) {
  try {
    const body: AddBatchRequestBody = await req.json();
    const { products, storeId: storeIdStr, storeManagerId } = await body;

    // Validate input, no empty arrays
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: 'items' should be a non-empty array." },
        { status: 400 }
      );
    }

    // Convert storeId from string to number
    const storeId = parseInt(storeIdStr, 10);

    //check for availability of store or partition
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

    // enable feature on UI, if inventory is initialized
    const bulkData = products.map((product) => ({
      ...product,
      storeId,
      storeManagerId,
    }));

    const bulkProductAdd = await db.inventory.createMany({
      data: bulkData,
      skipDuplicates: true,
    });

    if (!bulkProductAdd)
      return NextResponse.json(
        {
          error: "Couldn't process your bulk insert request, please try again",
        },
        { status: 400 }
      );

    return NextResponse.json(
      {
        message: `Processed Batch, ${bulkProductAdd.count} products to inventory`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Batch Upload Error in inventory:", err);
    return NextResponse.json(
      { error: "Batch upload error in inventory, Please check your internet" },
      { status: 500 }
    );
  }
}

// Endpoint to batch delete product from inventory
export async function DELETE(req: Request) {
  try {
    const body: DeleteProductBatchRequestBody = await req.json();
    const { productBatch } = body;

    if (!Array.isArray(productBatch) || productBatch.length === 0) {
      return NextResponse.json(
        {
          error: "Invalid request: 'productBatch' should be a non-empty array.",
        },
        { status: 400 }
      );
    }

    // Extract storeId and invId pairs
    const idsToDelete = productBatch.map((item) => ({
      storeId: item.storeId,
      invId: item.productId,
    }));

    // Validate existence of products before removal, through composite key
    const existingProducts = await db.inventory.findMany({
      where: {
        OR: idsToDelete.map(({ storeId, invId }) => ({ storeId, invId })),
      },
    });

    if (existingProducts.length === 0) {
      return NextResponse.json(
        { error: "No matching products found for deletion." },
        { status: 404 }
      );
    }

    // Perform batch delete using composite key logic
    const deleteResult = await db.inventory.deleteMany({
      where: {
        OR: idsToDelete.map(({ storeId, invId }) => ({
          storeId,
          invId,
        })),
      },
    });

    return NextResponse.json({
      message: `${deleteResult.count} products removed from inventory successfully.`,
    });
  } catch (err: unknown) {
    console.error("Error deleting items in inventory:", err);
    const errMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json(
      {
        error: `An error occurred while deleting inventory items: ${errMessage}`,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body: UpdateProductBatchRequestBody = await req.json();
    const { productBatch } = body;

    const idsToUpdate = productBatch.map((p) => ({
      storeId: p.storeId,
      invId: p.productId,
    }));

    // Validate existence of products before removal, through composite key
    const existingProducts = await db.inventory.findMany({
      where: {
        OR: idsToUpdate.map(({ storeId, invId }) => ({ storeId, invId })),
      },
    });

    if (existingProducts.length !== productBatch.length) {
      return NextResponse.json(
        { error: "Some products do not exist in the inventory." },
        { status: 404 }
      );
    }

    // Perform individual updates for each product
    const updatePromises = productBatch.map((product) =>
      db.inventory.update({
        where: {
          storeId_invId: {
            storeId: product.storeId,
            invId: product.productId,
          },
        },
        data: {
          invItemStock: {
            increment: product.recievedStock,
          },
        },
      })
    );

    const updatedProducts = await Promise.all(updatePromises);

    return NextResponse.json({
      message: "Products updated successfully",
      updatedProducts,
    });
  } catch (err) {
    console.error("Error deleting items in inventory:", err);
    const errMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json(
      {
        error: `An error occurred while deleting inventory items: ${errMessage}`,
      },
      { status: 500 }
    );
  }
}
