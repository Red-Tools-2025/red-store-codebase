import { BucketStatusRequestBody } from "@/app/types/buckets/api";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: BucketStatusRequestBody = await req.json();
    const { bucketId, storeId, status } = body;

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
    // Update bucket status directly and check if any rows were affected
    const statusChange = await db.bucket.update({
      where: { storeId_bucketId: { storeId, bucketId } },
      data: { isActive: status },
    });

    if (!statusChange) {
      return NextResponse.json(
        {
          error:
            "Bucket not found or something went wrong, please check params",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: `Bucket status updated, is now ${
          statusChange.isActive ? "active" : "inactive"
        }`,
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
