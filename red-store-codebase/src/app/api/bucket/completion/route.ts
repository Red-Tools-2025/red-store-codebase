import { BucketCompletionRequestBody } from "@/app/types/buckets/api";
import { db } from "@/lib/prisma";
import supabase from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: BucketCompletionRequestBody = await req.json();
    const { bucketId, remainingQty, storeId } = body;

    if (!bucketId || !storeId) {
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

    if (bucket.status !== "ACTIVE") {
      return NextResponse.json(
        {
          error: "Bucket is not active and cannot be completed",
        },
        { status: 400 }
      );
    }

    const bucket_amt = bucket.bucketSize === "FIFTY" ? 50 : 100;
    const soldQty = bucket_amt - remainingQty;

    const inventory_item = await db.inventory.update({
      where: { storeId_invId: { storeId, invId: bucket.invId } },
      data: { invItemStock: { increment: remainingQty } },
    });

    const timeseries_entry = {
      closing_stock: inventory_item.invItemStock - soldQty,
      sale_amount: bucket_amt,
      mrp_per_bottle: inventory_item.invItemPrice,
      opening_stock: inventory_item.invItemStock + soldQty,
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
      data: { status: "COMPLETED", soldQty },
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
