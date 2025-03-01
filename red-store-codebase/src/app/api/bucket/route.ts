import { CreateBucketResponseBody } from "@/app/types/buckets/api";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: CreateBucketResponseBody = await req.json();
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
        isActive: false,
        isCompleted: false,
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
