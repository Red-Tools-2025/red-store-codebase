import { FetchBucketListsRequestBody } from "@/app/types/buckets/api";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Route for getting bucket data
export async function GET(req: Request) {
  try {
    const body: FetchBucketListsRequestBody = await req.json();
    const { bucketId, storeId } = body;

    // gaurd clause to check for all params
    if (!bucketId || !storeId) {
      return NextResponse.json(
        {
          error: "All params are required",
        },
        { status: 400 }
      );
    }

    // fetch all buckets and their lists for store
    const buckets = await db.bucket.findMany({
      where: {
        bucketId: bucketId,
        storeId: storeId,
      },
      include: {
        bucketItems: { include: { inventory: true } },
      },
    });

    return NextResponse.json({ buckets }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error:
          "An error occurred while fetching bucket lists, Please check your connections and try again",
      },
      { status: 500 }
    );
  }
}
