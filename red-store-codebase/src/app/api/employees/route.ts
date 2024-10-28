import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Adjust the import path based on your project structure

// Interface for the incoming request body
interface AddEmployeeRequestBody {
  storeId: number;
  roleId: number;
  empName: string;
  empPhone: string;
  empStatus: boolean;
  storeManagerId: string; // This is used for partitioning
}

// Function to handle the POST request
export async function POST(req: Request) {
  try {
    // Parse the body of the request
    const body: AddEmployeeRequestBody = await req.json();
    const { storeId, roleId, empName, empPhone, empStatus, storeManagerId } = body;

    // Validation (add your own logic as needed)
    if (!storeId || !roleId || !empName || !empPhone || !storeManagerId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Ensure the partition exists for the store manager in the Employee table
    await db.$executeRaw`SELECT check_and_create_employee_partition(${storeManagerId});`;

    // Create a new employee record
    const employee = await db.employee.create({
      data: {
        storeId,
        roleId,
        empName,
        empPhone,
        empStatus,
        storeManagerId,
        createdAt: new Date(), // Automatically set the created timestamp
      },
    });

    // Return the newly created employee data
    return NextResponse.json(
      { message: `Employee ${employee.empName} added successfully`, employee },
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
