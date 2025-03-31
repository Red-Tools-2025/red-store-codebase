import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const store_id = Number(searchParams.get("store_id"));
  const store_manager_id = searchParams.get("store_manager_id") || "";

  try {
    const store = await db.store.findUnique({
      where: {
        storeId_storeManagerId: {
          storeId: store_id,
          storeManagerId: store_manager_id,
        },
      },
    });
    if (!store) {
      return NextResponse.json(
        {
          error: "Could not find store details",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        store: store,
        message: "Fetched store details",
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
          "An error occurred while getting store details, Please check your internet",
      },
      { status: 500 }
    );
  }
}
