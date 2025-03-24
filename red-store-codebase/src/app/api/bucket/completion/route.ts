import { db } from "@/lib/prisma";
import supabase from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bucketId, remainingQty, storeId, inventory_item } = body; // Changed from inventory_item to inventory_item

    console.log({ body });

    if (!bucketId || !storeId || !inventory_item) {
      return NextResponse.json(
        {
          error:
            "Required fields are missing or invalid, Please provide all params",
        },
        { status: 400 }
      );
    }

    const bucket = await db.bucket.findUnique({
      where: { storeId_bucketId: { storeId, bucketId } },
    });

    if (!bucket) {
      return NextResponse.json(
        {
          error: "Bucket not found",
        },
        { status: 404 }
      );
    }

    if (bucket.status !== "FINISHED") {
      return NextResponse.json(
        {
          error: "Bucket is not finished and cannot be completed",
        },
        { status: 400 }
      );
    }

    const bucket_amt = bucket.bucketSize === "FIFTY" ? 50 : 100;
    const soldQty = bucket_amt - remainingQty;

    // Calculate the stock values for accurate reporting

    // THIS portion of the route is extremely important as it contains the cached data
    const opening_stock = inventory_item.invItemStock + bucket_amt;
    const closing_stock = inventory_item.invItemStock + remainingQty;

    await db.inventory.update({
      where: { storeId_invId: { storeId, invId: bucket.invId } },
      data: { invItemStock: { increment: remainingQty } },
    });

    const timeseries_entry = {
      closing_stock: closing_stock,
      sale_amount: bucket_amt,
      mrp_per_bottle: inventory_item.invItemPrice,
      opening_stock: opening_stock,
      product_id: inventory_item.invId,
      product_name: inventory_item.invItem,
      received_stock: 0,
      sales: soldQty,
      store_id: storeId,
      time: new Date(Date.now()).toISOString(),
    };

    const { error: TimeseriesInsertionError } = await supabase
      .from("inventory_timeseries")
      .insert(timeseries_entry);

    if (TimeseriesInsertionError)
      return NextResponse.json(
        { error: TimeseriesInsertionError.message },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

    await db.bucket.update({
      where: { storeId_bucketId: { storeId, bucketId } },
      data: {
        status: "COMPLETED",
        soldQty,
        completedTime: new Date(Date.now()),
      },
    });

    return NextResponse.json(
      { message: `Bucket ${bucketId} completed successfully` },
      { status: 200 }
    );
  } catch (err) {
    console.error("Completion error with bucket", err);
    return NextResponse.json(
      {
        error:
          "An error occurred while completing the bucket, Please check your connections and try again",
      },
      { status: 500 }
    );
  }
}
