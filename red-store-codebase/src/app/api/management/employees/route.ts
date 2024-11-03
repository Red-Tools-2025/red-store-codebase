import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Adjust the import path based on your project structure

// Interface for the incoming request body
interface AddEmployeeRequestBody {
  storeId: number | string; // Allow both number and string to handle conversion
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

    // Convert storeId to an integer if it’s a string
    const storeId = Number(body.storeId);
    const { roleId, empName, empPhone, empStatus, storeManagerId } = body;

    // Ensure the partition exists for the store manager in the Employee table
    await db.$executeRaw`SELECT check_and_create_employee_partition(${storeId}::integer);`;

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
