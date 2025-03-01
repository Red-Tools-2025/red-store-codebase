import {
  CreateBucketRequestBody,
  DeleteBucketRequestBody,
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
