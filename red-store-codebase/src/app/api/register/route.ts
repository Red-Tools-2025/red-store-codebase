import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";

interface RegisterRouteRequestType extends NextRequest {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: RegisterRouteRequestType) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    const existingUser = await db.user.findUnique({
      where: { email: email },
    });

    // Initial check to see if user already exists
    if (existingUser)
      return NextResponse.json({
        error: "Account already exists",
        status: 400,
      });

    // Hashing password on 10 salt rounds
    const hashedPwd = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.user.create({
      data: {
        password: hashedPwd,
        email: email,
        name: name,
        roleId: 2, // roleID - 2 corresponds to manager
      },
    });

    return NextResponse.json(
      { message: `User created successfully for ${user.email}` },
      { status: 201 }
    );
  } catch (err) {
    // response when internet correction weak, or error during dev
    console.error("Error creating user:", err);
    return NextResponse.json({
      error: "An error occurred while creating account",
      details: "Huge error here",
      status: 500,
    });
  }
}
