import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/prisma"; // Adjust the import path as necessary

// Interface for the incoming request
interface AddEmployeeRequestType extends NextRequest {
  empName: string;
  empPhone: string;
  storeId: number; // Adjust type based on your database schema
  roleName: string; // Role name as string instead of ID
}

export async function POST(req: AddEmployeeRequestType) {
  try {
    // Parse the body of the request
    const body = await req.json();
    const { empName, empPhone, storeId, roleName } = body;

    // Check if the phone number already exists
    const existingEmployee = await db.employee.findFirst({
      where: { empPhone },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 400 }
      );
    }

    // Find the role by roleName
    const role = await db.role.findFirst({
      where: { roleType: roleName.toUpperCase() }, // Ensure matching case with enum
    });

    if (!role) {
      return NextResponse.json(
        { error: "Invalid role name provided" },
        { status: 400 }
      );
    }

    // Create a new employee record
    const employee = await db.employee.create({
      data: {
        empName,
        empPhone,
        storeId,
        roleId: role.roleId, // Use the found role's ID
        createdAt: new Date(), // Add createdAt timestamp
        empStatus: true, // Default to active
      },
    });

    // Prepare response data without BigInt serialization
    const responseData = {
      empId: employee.empId, // Assuming empId is a number or string
      storeId: employee.storeId, // Assuming storeId is compatible
      roleId: employee.roleId, // Assuming roleId is compatible
      createdAt: employee.createdAt,
      empName: employee.empName,
      empPhone: employee.empPhone,
      empStatus: employee.empStatus,
    };

    return NextResponse.json(
      { message: `Employee ${employee.empName} added successfully`, employee: responseData },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding employee:", err);
    return NextResponse.json(
      { error: "An error occurred while adding the employee" },
      { status: 500 }
    );
  }
}
