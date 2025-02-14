import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

interface MobLoginRouteRequestType {
  empphone: string;
  empname: string;
  storename: string;
}

export async function OPTIONS() {
  // Handle preflight requests for CORS
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow requests from all origins
        "Access-Control-Allow-Methods": "POST, OPTIONS", // Allow POST and OPTIONS methods
        "Access-Control-Allow-Headers": "Content-Type", // Allow specific headers
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const body: MobLoginRouteRequestType = await req.json();
    const { empname, empphone, storename } = body;

    // Search for the store with a case-insensitive search
    const store = await db.store.findMany({
      where: {
        storeName: {
          contains: storename,
          mode: "insensitive", // Case-insensitive search
        },
      },
    });

    if (!store || store.length === 0) {
      return NextResponse.json(
        {
          error: "Store does not exist",
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Search for the employee
    const emp = await db.employee.findMany({
      where: {
        storeId: store[0].storeId,
        empName: {
          contains: empname,
          mode: "insensitive",
        },
        empPhone: empphone,
      },
    });

    if (!emp || emp.length === 0) {
      return NextResponse.json(
        {
          error: "Employee details or not found",
        },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Employee found, return response
    return NextResponse.json(
      {
        emp,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        error: "An error occurred",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
