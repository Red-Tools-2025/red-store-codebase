import { MobileLoginResponse } from "@/app/types/auth/login";
import { Employee } from "@prisma/client";

import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Edit later to incorporate caching logic
interface VerifyOtpRequestType {
  employee_details: Employee;
}

export async function POST(req: Request) {
  try {
    const body: VerifyOtpRequestType = await req.json();
    const { employee_details: emp } = body;

    console.log({ emp });

    // For now just set the cookie header logic for auth

    // Create Web Token
    const token = jwt.sign(
      {
        empId: emp.empId,
        empName: emp.empName,
        empPhone: emp.empPhone,
        storeId: emp.storeId,
        storeManagerId: emp.storeManagerId,
      },
      "emp-token-key",
      {
        expiresIn: "2h",
      }
    );

    // send in a response
    const response = NextResponse.json({ verified: true }, { status: 200 });

    // set cookie in header
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
