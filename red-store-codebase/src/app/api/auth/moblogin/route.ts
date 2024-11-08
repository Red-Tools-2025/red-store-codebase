import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/prisma";

interface MobLoginRouteRequestType extends NextRequest {
  empphone: string;
  empname: string;
  storename: string;
}

export async function POST(req: Request) {
  try {
    const body: MobLoginRouteRequestType = await req.json();
    const { empname, empphone, storename } = body;

    // Use `contains` to search for any of these keywords in storeName
    const store = await db.store.findMany({
      where: {
        storeName: {
          contains: storename,
          mode: "insensitive", // Case-insensitive search
        },
      },
    });

    if (!store || store.length === 0)
      return NextResponse.json({
        error: "Store does not exist",
      });

    // Return and verify the right employee information
    // strictly ensure if full name, first name then last name
    const emp = await db.employee.findMany({
      where: {
        storeId: store[0].storeId,
        empName: {
          contains: empname, // handles all cases of name entry
          mode: "insensitive",
        },
        empPhone: empphone,
      },
    });

    if (!emp || emp.length === 0)
      return NextResponse.json(
        {
          error: "Employee details not found",
        },
        { status: 404 }
      );

    // Store found, return response
    return NextResponse.json(
      {
        emp,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        error: `An error occurred`,
      },
      {
        status: 500,
      }
    );
  }
}
