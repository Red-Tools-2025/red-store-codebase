import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// fetches product for cart
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const store_id = searchParams.get("storeId");
    const product_barcode_number = searchParams.get("barcodeno");

    if (!store_id || !product_barcode_number)
      return NextResponse.json(
        { error: "product barcode and store id are required" },
        { status: 404 }
      );

    // Convert storeId and productbarcodes to a number
    const storeId = parseInt(store_id, 10);
    const itemBarcode = parseInt(product_barcode_number, 10);

    const product = await db.inventory.findFirst({
      where: {
        AND: [{ storeId: storeId }, { invItemBarcode: itemBarcode }],
      },
    });

    // check if product even exists
    if (!product)
      return NextResponse.json(
        { error: "Could not find product in store" },
        { status: 404 }
      );

    // check product stock levels
    if (product.invItemStock === 0)
      return NextResponse.json(
        { error: "Product not in stock" },
        { status: 404 }
      );

    return NextResponse.json(
      {
        message: "Item added to cart",
        product,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
  }
}
