import { AddBucketItemRequestBody } from "@/app/types/buckets/api";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: AddBucketItemRequestBody = await req.json();
    const { bucketId, bucket_item, storeId } = body;

    // gaurd clause to check all params
    if (!bucketId || !bucket_item || !storeId) {
      return NextResponse.json(
        {
          error: "All params are required",
        },
        {
          status: 400,
        }
      );
    }

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

    // Object deconstruction of bucket item
    const { bucketQty, invId } = bucket_item;

    // gaurd clause to check if item exists in the bucket
    const existingItem = await db.bucketItems.findUnique({
      where: {
        bucketId_invId: { bucketId, invId },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        {
          error: "Item already in bucket",
        },
        {
          status: 400,
        }
      );
    }

    const add_item = await db.bucketItems.create({
      data: {
        bucketQty,
        bucketId,
        invId,
        storeId,
      },
    });

    return NextResponse.json(
      {
        message: `Item with Id ${invId} added to Bucket ${bucketId}`,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error:
          "An error occurred while adding item to the bucket list, Please check your connections and try again",
      },
      { status: 500 }
    );
  }
}
