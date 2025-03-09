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
      bucket_item_details: { bucketQty, invId },
    } = body;

    // gaurd clause for all required params
    if (!storeId || !storeManagerId || !scheduledTime || !bucketQty || !invId) {
      return NextResponse.json(
        {
          error:
            "Required fields are missing or invalid, Please provide all params",
        },
        { status: 400 }
      );
    }

    // Validate Bucket Size entry
    if (!["FIFTY", "HUNDRED"].includes(bucketQty)) {
      return NextResponse.json(
        {
          error: "Bucket Quantity Type is Invalid or not allowed",
        },
        { status: 400 }
      );
    }

    // Validation against quantity of item during creation
    const inventory_item = await db.inventory.findUnique({
      where: {
        storeId_invId: { storeId, invId },
      },
    });

    if (!inventory_item) {
      return NextResponse.json(
        {
          error: "Could not find inventory Item, Refresh or check inventory",
        },
        { status: 400 }
      );
    }

    const bucket_amt = bucketQty === "FIFTY" ? 50 : 100;

    if (inventory_item?.invItemStock < bucket_amt) {
      return NextResponse.json(
        {
          error: "Not enough stock to assign to bucket",
        },
        { status: 400 }
      );
    }
    // physical partition creation
    await db.$executeRaw`SELECT check_and_create_buckets_partition(${storeId}::integer);`;

    // Validation against number of buckets for the same product
    const item_buckets = await db.bucket.findMany({
      where: {
        storeId,
        invId,
        status: {
          not: BucketStatus.COMPLETED,
        },
      },
    });

    console.log(
      `Bucket count for item ${invId} at store ${storeId}: ${item_buckets.length}`
    );

    if (item_buckets.length === 5) {
      return NextResponse.json(
        {
          error: "Item Bucket limit reached, max (5) allowed",
        },
        {
          status: 400,
        }
      );
    }

    // Guard clause for back calculation, against validity of bucket creation below limit
    const net_bucket_allocation = item_buckets.reduce((acc, item_bucket) => {
      return acc + (item_bucket.bucketSize === "FIFTY" ? 50 : 100);
    }, 0);

    const remaining_available_to_allocate =
      inventory_item.invItemStock - net_bucket_allocation;

    if (net_bucket_allocation > remaining_available_to_allocate) {
      return NextResponse.json(
        {
          error:
            "Can't further create any more buckets, as allocation exceeds remaining allocation amount",
        },
        { status: 400 }
      );
    }
    // bucket creation
    const bucket = await db.bucket.create({
      data: {
        status: BucketStatus.INACTIVE,
        soldQty: 0,
        createdAt: new Date(),
        scheduledTime,
        activationTime: "",
        completedTime: "",
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
    const { buckets } = body;

    // Guard clause to verify all params
    if (!buckets || buckets.length === 0) {
      return NextResponse.json(
        {
          error:
            "Required fields are missing or invalid, Please provide all params",
        },
        { status: 400 }
      );
    }

    if (buckets.length === 1) {
      // Single bucket deletion
      const { storeId, bucketId } = buckets[0];

      const bucket = await db.bucket.findUnique({
        where: { storeId_bucketId: { storeId, bucketId } },
      });

      if (!bucket) {
        return NextResponse.json(
          { error: "Bucket already deleted, or not found" },
          { status: 404 }
        );
      }

      if (bucket.status === "ACTIVE") {
        return NextResponse.json(
          { error: "Bucket is already running, cannot delete" },
          { status: 400 }
        );
      }

      const deleted_bucket = await db.bucket.delete({
        where: { storeId_bucketId: { storeId, bucketId } },
      });

      return NextResponse.json({
        message: `Removed Bucket: ${deleted_bucket.bucketId}`,
      });
    } else {
      // Bulk bucket deletion
      const inactiveBuckets = await db.bucket.findMany({
        where: {
          OR: buckets.map(({ storeId, bucketId }) => ({ storeId, bucketId })),
          status: { not: "ACTIVE" },
        },
      });

      if (inactiveBuckets.length === 0) {
        return NextResponse.json(
          { error: "No inactive buckets found to delete" },
          { status: 400 }
        );
      }

      const deletedBuckets = await db.bucket.deleteMany({
        where: {
          OR: inactiveBuckets.map(({ storeId, bucketId }) => ({
            storeId,
            bucketId,
          })),
        },
      });

      return NextResponse.json({
        message: `Removed ${deletedBuckets.count} buckets`,
      });
    }
  } catch (err) {
    console.error("Deletion error with bucket", err);
    return NextResponse.json(
      {
        error:
          "An error occurred while deleting the bucket(s), Please check your connections and try again",
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

// Route to fetch buckets
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const store_id = searchParams.get("storeId");

    if (!store_id) {
      return NextResponse.json(
        { error: "storeId and storeManagerId are required" },
        { status: 400 }
      );
    }

    // Convert storeId to a number
    const storeId = parseInt(store_id, 10);

    const buckets = await db.bucket.findMany({
      where: {
        storeId: storeId,
      },
      include: {
        inventory: true,
      },
    });

    if (!buckets) {
      return NextResponse.json(
        {
          error: "Buckets for store seem not to exist",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Successfully fetched bucket data",
        buckets,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Updation error with bucket", err);
    return NextResponse.json(
      {
        error:
          "An error occurred while fetching buckets. Please check your connections and try again.",
      },
      { status: 500 }
    );
  }
}
