// Route handles all scenaiors pertaining to add, update and delete in bucket items

import { AddBucketItemRequestBody } from "@/app/types/buckets/api";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// For adding items to bucket
export async function POST(req: Request) {
  try {
    const body: AddBucketItemRequestBody = await req.json();
    const {
      bucketId,
      bucket_item: { bucketQty, invId },
      storeId,
    } = await body;

    // gaurd clause to check all params
    if (!bucketId || !invId || !bucketQty || !storeId) {
      return NextResponse.json(
        {
          error: "All params are required for adding items to bucket",
        },
        {
          status: 400,
        }
      );
    }

    // First we ensure if the paritition exists
    await db.$executeRaw`SELECT check_and_create_bucket_items_partition(${bucketId}::integer);`;

    // verify, if bucket exists and if it is active or not
    const bucket = await db.bucket.findUnique({
      where: {
        storeId_bucketId: { storeId, bucketId },
      },
    });

    // if bucket exists
    if (!bucket) {
      return NextResponse.json({ error: "Bucket not found." }, { status: 404 });
    }

    // if the bucket is active, prevent additions of products into it
    if (bucket?.isActive === true) {
      return NextResponse.json(
        {
          error: `Bucket is currently active, cannot add new product set to it`,
        },
        { status: 400 }
      );
    }

    // then check if the product already exists within the bucket
    const existing = await db.bucketItems.findUnique({
      where: {
        bucketId_invId: { bucketId, invId },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: "Product already allotted to bucket",
        },
        {
          status: 409,
        }
      );
    }

    await db.bucketItems.create({
      data: {
        bucketQty,
        bucketId,
        invId,
        storeId,
      },
    });

    return NextResponse.json(
      {
        message: "Product added to inventory",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Error on item add to bucket", err);
    return NextResponse.json(
      {
        error:
          "An error occurred while adding the product to your bucket, Please check your connections and try again",
      },
      { status: 500 }
    );
  }
}
