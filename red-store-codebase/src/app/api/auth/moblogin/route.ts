import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import jwt from "jsonwebtoken";

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

    // Create Web Token
    const token = jwt.sign(
      {
        empId: emp[0].empId,
        empName: emp[0].empName,
        empPhone: emp[0].empPhone,
        storeId: emp[0].storeId,
        storeManagerId: emp[0].storeManagerId,
      },
      "emp-token-key",
      {
        expiresIn: "2h",
      }
    );

    // No return of web token store to http-cookie
    const response = NextResponse.json(
      {
        verifiedRedirect: true,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

    response.cookies.set({
      name: "authToken",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days expiration
    });

    return response;
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
