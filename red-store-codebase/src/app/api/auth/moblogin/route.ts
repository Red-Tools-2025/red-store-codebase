import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { error } from "console";

interface MobLoginRouteRequestType extends NextRequest {
  empphone: string;
  empname: string;
  store_Id: number;
}

export async function GET(req: MobLoginRouteRequestType) {
  try {
    const body = await req.json();
    const { empname, empphone, store_Id } = body;

    const storeId = await db.store.findMany({
      where: {
        storeId: store_Id,
      },
    });

    if (storeId.length < 0)
      return NextResponse.json({
        error: "Store does not exist",
      });
  } catch (err) {}
}
