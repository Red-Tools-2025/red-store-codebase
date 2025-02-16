import { GetEmployeeStoreRequestBody } from "@/app/types/emp/api";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const body: GetEmployeeStoreRequestBody = await req.json();
  const { store_id, store_manager_id } = body;
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
