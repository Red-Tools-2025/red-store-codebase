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

    console.log({ storename });

    // tokenize storename
    const tokenized_storename = storename
      .replace(/[^a-zA-Z0-9\s]/g, "") // Remove non-alphanumeric characters
      .toLowerCase() // Convert to lowercase
      .split(" ") // Split into individual words
      .filter(Boolean); // Remove any empty strings

    if (tokenized_storename.length === 0) {
      return NextResponse.json(
        {
          error: "Invalid store name provided",
        },
        {
          status: 400, // bad request
        }
      );
    }

    // Use `contains` to search for any of these keywords in storeName
    const store = await db.store.findMany({
      where: {
        OR: tokenized_storename.map((token: string) => ({
          storeName: {
            contains: token,
            mode: "insensitive", // Case-insensitive search
          },
        })),
      },
    });

    if (!store || store.length === 0)
      return NextResponse.json(
        {
          error: "Store does not exist",
        },
        { status: 404 }
      );

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
