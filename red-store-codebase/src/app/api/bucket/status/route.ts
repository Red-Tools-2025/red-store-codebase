import { BucketStatusRequestBody } from "@/app/types/buckets/api";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Route for handling changes in the bucket state (Active or Inactive)
export async function POST(req: Request) {
  try {
    const body: BucketStatusRequestBody = await req.json();
    const { bucketId, storeId, status, soldQty } = body;

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

    // Validate status
    if (!["ACTIVE", "INACTIVE"].includes(status)) {
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

    // Update bucket status directly and check if any rows were affected
    const statusChange = await db.bucket.update({
      where: { storeId_bucketId: { storeId, bucketId } },
      data: { status: status, soldQty },
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
    let message = "";

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
      message = `Bucket paused, Items sold so far recorded`;
      await db.inventory.update({
        where: {
          storeId_invId: { storeId, invId: statusChange?.invId },
        },
        data: {
          invItemStock: { increment: bucket_amt - soldQty },
        },
      });
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
