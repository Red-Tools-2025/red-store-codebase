// Route handles all scenaiors pertaining to add, update and delete in bucket items

import {
  AddBucketItemsBulkRequestBody,
  EmptyBucketListRequestBody,
} from "@/app/types/buckets/api";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// For adding items to bucket
export async function POST(req: Request) {
  try {
    const body: AddBucketItemsBulkRequestBody = await req.json();
    const { bucketId, bucket_items, storeId } = await body;

    // gaurd clause to check all params
    if (!bucketId || !bucket_items || !storeId) {
      return NextResponse.json(
        {
          error: "All params are required for adding items to bucket",
        },
        {
          status: 400,
        }
      );
    }

    // gaurd claude to check empty bucket
    if (bucket_items.length === 0) {
      return NextResponse.json(
        {
          error: "Bucket List is empty, please add bucket items to continue",
        },
        { status: 400 }
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

    const bucket_items_new = bucket_items.map((bucket_item) => ({
      bucketId,
      storeId,
      bucketQty: bucket_item.bucketQty,
      invId: bucket_item.invId,
    }));

    await db.bucketItems.createMany({
      data: bucket_items_new,
    });

    return NextResponse.json(
      {
        message: `Products added to bucket --> Bucket ${bucketId}`,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log("Error on item add to bucket", err);
    return NextResponse.json(
      {
        error:
          "An error occurred while adding the product to your bucket, Please check your connections and try again",
      },
      { status: 500 }
    );
  }
}

// Route for emptying the whole bucket list
export async function DELETE(req: Request) {
  try {
    const body: EmptyBucketListRequestBody = await req.json();
    const { bucketId } = body;

    // gaurd clause for checking if bucketId is provided
    if (!bucketId) {
      return NextResponse.json(
        {
          error: "All params are required",
        },
        {
          status: 400,
        }
      );
    }

    // empty bucketlist with all items associated with given bucketID
    const empty_bucket = await db.bucketItems.deleteMany({
      where: {
        bucketId: bucketId,
      },
    });

    return NextResponse.json(
      {
        message: `Emptied Bucket ${bucketId} : ${empty_bucket.count} bucket items removed`,
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
          "An error occurred while emptying the bucket list, Please check your connections and try again",
      },
      { status: 500 }
    );
  }
}
