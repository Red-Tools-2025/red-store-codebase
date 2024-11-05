import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Adjust the import path based on your project structure
import { AddEmployeeRequestBody } from "@/app/types/management/employee";

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

//fetching employees for a given store
// endpoint -- http://localhost:3000/api/management/employees?storeID=${IDhere}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const storeManagerID = searchParams.get("storeManagerID");

    if (!storeManagerID) {
      return NextResponse.json(
        { error: "storeManagerID is required" },
        { status: 400 }
      );
    }

    // Fetch employees along with the roleType based on roleId
    const emp_for_manager = await db.employee.findMany({
      where: {
        storeManagerId: storeManagerID,
      },
      include: {
        role: {
          select: {
            roleType: true, // Fetch only the roleType field from the Role model
          },
        },
      },
    });

    if (emp_for_manager.length === 0) {
      return NextResponse.json(
        {
          message: "No employees assigned to stores for this manager.",
          emp_data: emp_for_manager,
        },
        { status: 200 }
      );
    }

    // Return employees found for the manager, including role type
    return NextResponse.json(
      {
        message: "Data retrieved successfully",
        emp_for_manager,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error fetching employees for manager");
    const errMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json(
      {
        error: `An error occurred while fetching employees for manager: ${errMessage}`,
      },
      { status: 500 }
    );
  }
}

