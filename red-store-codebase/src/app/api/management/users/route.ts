import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface RegisterRouteRequestType extends NextRequest {
  name: string;
  email: string;
  password: string;
  role: string;  // Should match RoleType from the Prisma schema
  phone: string; // Phone field as per your schema
}

export async function POST(req: RegisterRouteRequestType) {
  try {
    const body = await req.json();
    const { name, email, password, role, phone } = body;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find the role by RoleType
    const userRole = await db.role.findFirst({
      where: { roleType: role },
    });

    if (!userRole) {
      return NextResponse.json(
        { error: "Invalid role type provided" },
        { status: 400 }
      );
    }

    // Create the new user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: userRole.roleId,
        phone, // Save the phone number in the user record
      },
    });

    // Return success response
    return NextResponse.json(
      { message: `User created successfully for ${user.email}` },
      { status: 201 }
    );

  } catch (err) {
    console.error("Error creating user:", err);
    return NextResponse.json(
      { error: "An error occurred while creating the user" },
      { status: 500 }
    );
  }
}
