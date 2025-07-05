import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id; // Extract product ID from URL
    const body = await req.json();
    const { storeId, updates } = body;

    // Validate required fields
    if (!productId || !storeId || !updates) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Convert storeId and productId to numbers
    const storeIdNumber = Number(storeId);
    const productIdNumber = Number(productId);

    if (isNaN(storeIdNumber) || isNaN(productIdNumber)) {
      return NextResponse.json(
        { error: "Invalid storeId or productId." },
        { status: 400 }
      );
    }

    // Find the existing product
    const existingProduct = await db.inventory.findFirst({
      where: { storeId: storeIdNumber, invId: productIdNumber },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    // Update the product
    const updatedProduct = await db.inventory.update({
      where: {
        storeId_invId: {
          storeId: storeIdNumber,
          invId: productIdNumber,
        },
      },
      data: updates,
    });

    return NextResponse.json(
      {
        message: `Product '${updatedProduct.invItem}' updated successfully.`,
        updatedProduct,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating product:", err);
    return NextResponse.json(
      { error: "An error occurred while updating the product." },
      { status: 500 }
    );
  }
}
