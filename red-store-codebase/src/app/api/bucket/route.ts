import { CreateBucketResponseBody } from "@/app/types/buckets/api";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: CreateBucketResponseBody = await req.json();
    const { allotedDeadline, storeId, storeManagerId, duration } = body;

    // gaurd clause for all required params
    if (!allotedDeadline || !storeId || !storeManagerId || !duration) {
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

    // bucket creation, allot an empty array of bucket Items
    const bucket = await db.bucket.create({
      data: {
        deadline: allotedDeadline,
        isActive: false,
        soldQty: 0,
        createdAt: new Date(),
        storeId: storeId,
        bucketItems: {
          create: [],
        },
        storeManagerId,
        duration,
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
