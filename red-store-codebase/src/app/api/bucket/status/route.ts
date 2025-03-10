import { BucketStatusRequestBody, TimeSeries } from "@/app/types/buckets/api";
import { db } from "@/lib/prisma";
import supabase from "@/lib/supabase/client";
import { NextResponse } from "next/server";

// Route for handling changes in the bucket state (Active or Inactive)
export async function POST(req: Request) {
  try {
    const body: BucketStatusRequestBody = await req.json();
    const { bucketId, storeId, status, soldQty = 0 } = body;

    console.log({ body });

    // gaurd clause for all required params
    if (!bucketId || !storeId || !status) {
      return NextResponse.json(
        {
          error:
            "Required fields are missing or invalid, Please provide all params",
        },
        { status: 400 }
      );
    }

    if (!["ACTIVE", "INACTIVE", "FINISHED"].includes(status)) {
      // Validate status
      return NextResponse.json(
        {
          error: "Invalid status provided",
        },
        { status: 400 }
      );
    }

    // Ensure soldQty is a valid number when status is INACTIVE
    if (status === "INACTIVE" && (typeof soldQty !== "number" || soldQty < 0)) {
      return NextResponse.json(
        {
          error: "Invalid soldQty provided",
        },
        { status: 400 }
      );
    }

    // Gaurd clause to ensure no repeated activations, or inactivations are allowed (potential API misuse)
    const existingBucket = await db.bucket.findUnique({
      where: { storeId_bucketId: { storeId, bucketId } },
    });

    if (!existingBucket) {
      return NextResponse.json({ error: "Bucket not found" }, { status: 404 });
    }

    // Guard clause to prevent updating active status to "ACTIVE" if it's already active
    if (existingBucket.status === status) {
      return NextResponse.json(
        {
          error: `Bucket is already ${status}, no further action needed`,
        },
        { status: 400 }
      );
    }

    // Guard clause to prevent completed buckets from status change
    if (existingBucket.status === "COMPLETED") {
      return NextResponse.json(
        {
          error: `Bucket already marked as completed`,
        },
        { status: 400 }
      );
    }

    // Update bucket status directly and check if any rows were affected
    const statusChange = await db.bucket.update({
      where: { storeId_bucketId: { storeId, bucketId } },
      data: {
        status: status,
        soldQty,
        /* We only need to mark time for activation */
        ...(status === "ACTIVE"
          ? { activationTime: new Date(Date.now()) }
          : {}),
      },
    });

    if (!statusChange) {
      return NextResponse.json(
        {
          error:
            "Something went wrong while updating state, please check params",
        },
        { status: 404 }
      );
    }

    // verfiy if stock is available for deduction, on client side not here

    const bucket_amt = statusChange.bucketSize === "FIFTY" ? 50 : 100;
    let message = `Bucket status updated, is now ${statusChange.status}`;

    // Update inventory based on state of activity
    if (status === "ACTIVE") {
      // if the bucket is set to active either by the user or when it's time we immedialty update inventory to reserve items for the bucket
      message = `Bucket status updated, is now ${statusChange.status}`;
      await db.inventory.update({
        where: {
          storeId_invId: { storeId, invId: statusChange?.invId },
        },
        data: {
          invItemStock: { decrement: bucket_amt },
        },
      });
    } else if (status === "INACTIVE") {
      // When pausing the inventory, it's best to save it to mark sales for that point and record them later
      const inventory_item = await db.inventory.update({
        where: {
          storeId_invId: { storeId, invId: statusChange?.invId },
        },
        data: {
          invItemStock: { increment: bucket_amt - soldQty },
        },
      });

      // It's also important you log the time as a measure of how many products where sold at that point of time
      const timeseries_entry: TimeSeries = {
        closing_stock: inventory_item.invItemStock,
        sale_amount: soldQty * inventory_item.invItemPrice,
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
      message = `Bucket paused, Items sold so far recorded`;
    }

    return NextResponse.json(
      {
        message,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Creation error with bucket", err);
    return NextResponse.json(
      {
        error:
          "An error occurred while creating the bucket, Please check your connections and try again",
      },
      { status: 500 }
    );
  }
}
