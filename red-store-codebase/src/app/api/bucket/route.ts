import {
  CreateBucketRequestBody,
  DeleteBucketRequestBody,
  UpdateBucketRequestBody,
} from "@/app/types/buckets/api";
import { db } from "@/lib/prisma";
import { BucketStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: CreateBucketRequestBody = await req.json();
    const {
      storeId,
      storeManagerId,
      scheduledTime,
      duration,
      bucket_item_details: { bucketQty, invId },
    } = body;

    // gaurd clause for all required params
    if (
      !storeId ||
      !storeManagerId ||
      !scheduledTime ||
      !duration ||
      !bucketQty ||
      !invId
    ) {
      return NextResponse.json(
        {
          error:
            "Required fields are missing or invalid, Please provide all params",
        },
        { status: 400 }
      );
    }

    // physical partition creation
    await db.$executeRaw`SELECT check_and_create_buckets_partition(${storeId}::integer);`;

    // bucket creation
    const bucket = await db.bucket.create({
      data: {
        status: BucketStatus.INACTIVE,
        soldQty: 0,
        createdAt: new Date(),
        scheduledTime,
        storeId: storeId,
        bucketSize: bucketQty,
        invId: invId,
        storeManagerId,
        // by default for now all durations are set for 1 hour
        duration: 3600,
      },
    });

    return NextResponse.json(
      {
        message: `Bucket Created successfully`,
        bucket,
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

// Route for deleting a bucket only if it is not active
export async function DELETE(req: Request) {
  try {
    const body: DeleteBucketRequestBody = await req.json();
    const { bucketId, storeId } = body;

    // Guard clause to verify all params
    if (!bucketId || !storeId) {
      return NextResponse.json(
        {
          error:
            "Required fields are missing or invalid, Please provide all params",
        },
        { status: 400 }
      );
    }

    // Verify and delete bucket only if it's inactive or completed

    const bucket = await db.bucket.findUnique({
      where: { storeId_bucketId: { storeId, bucketId } },
    });

    if (!bucket) {
      return NextResponse.json(
        {
          error: "Bucket already deleted, or not found",
        },
        { status: 404 }
      );
    }

    if (bucket.status === BucketStatus.ACTIVE) {
      return NextResponse.json(
        {
          error: "Bucket is already running cannot delete",
        },
        { status: 400 }
      );
    }

    const deleted_bucket = await db.bucket.delete({
      where: { storeId_bucketId: { storeId, bucketId } },
    });

    return NextResponse.json({
      message: `Removed Bucket : ${deleted_bucket.bucketId}`,
    });
  } catch (err) {
    console.error("Deletion error with bucket", err);
    return NextResponse.json(
      {
        error:
          "An error occurred while deleting the bucket, Please check your connections and try again",
      },
      { status: 500 }
    );
  }
}

// Route for editing a bucket if and only if the bucket is in an incactive state
export async function PUT(req: Request) {
  try {
    const body: UpdateBucketRequestBody = await req.json();
    const { bucketId, storeId, scheduledTime, bucketQty } = body;

    // Guard clause for required params
    if (!bucketId || !storeId || !scheduledTime || !bucketQty) {
      return NextResponse.json(
        {
          error:
            "Required fields are missing or invalid. Please provide all params.",
        },
        { status: 400 }
      );
    }

    // Find the bucket and ensure it exists and is inactive
    const bucket = await db.bucket.findUnique({
      where: { storeId_bucketId: { storeId, bucketId } },
    });

    if (!bucket) {
      return NextResponse.json({ error: "Bucket not found." }, { status: 404 });
    }

    if (bucket.status !== BucketStatus.INACTIVE) {
      return NextResponse.json(
        { error: "Bucket can only be edited when it is in an inactive state." },
        { status: 400 }
      );
    }

    // Update the bucket
    const updatedBucket = await db.bucket.update({
      where: { storeId_bucketId: { storeId, bucketId } },
      data: {
        scheduledTime,
        bucketSize: bucketQty,
      },
    });

    return NextResponse.json(
      {
        message: "Bucket updated successfully.",
        bucket: updatedBucket,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Updation error with bucket", err);
    return NextResponse.json(
      {
        error:
          "An error occurred while updating the bucket. Please check your connections and try again.",
      },
      { status: 500 }
    );
  }
}
