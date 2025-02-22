import { CreateBucketResponseBody } from "@/app/types/buckets/api";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: CreateBucketResponseBody = await req.json();
    const { allotedDeadline, bucketQty, invId, invItemName, storeId } = body;

    // gaurd clause for all required params
    if (!allotedDeadline || !bucketQty || !invId || !invItemName || storeId) {
      return NextResponse.json(
        {
          error:
            "Required fields are missing or invalid, Please provide all params",
        },
        { status: 400 }
      );
    }

    const bucket = await db.bucket.create({
      data: {
        bucketQty: bucketQty,
        deadline: allotedDeadline,
        invItem: invItemName,
        isActive: false,
        soldQty: 0,
        createdAt: new Date(),
        invId: invId,
        storeId: storeId,
      },
    });
  } catch (err) {
    console.error("Upload Error adding inventory:", err);
    return NextResponse.json(
      {
        error:
          "An error occurred while creating the bucket, Please check your internet",
      },
      { status: 500 }
    );
  }
}
