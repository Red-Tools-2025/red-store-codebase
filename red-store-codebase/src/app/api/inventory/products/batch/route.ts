import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Interface for the incoming request body for adding batch to inventory
interface AddBatchRequestBody {
  storeId: string; // Store ID received as a string
  storeManagerId: string; // Assuming this is a user ID
  products: {
    invItem: string;
    invItemBrand: string;
    invItemStock: number;
    invItemPrice: number;
    invItemType: string;
    invItemBarcode: number;
    invItemSize: number;
    invAdditional?: any;
  }[];
}

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

    if (!bulkData)
      return NextResponse.json(
        {
          error: "Couldn't process your bulk insert request, please try again",
        },
        { status: 400 }
      );

    return NextResponse.json(
      {
        message: "Processed Batch add to inventory",
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
