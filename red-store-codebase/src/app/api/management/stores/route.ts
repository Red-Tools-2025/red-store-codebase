import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Adjust the import path based on your project structure

// Interface for the incoming request body
interface AddStoreRequestBody {
  storeName: string;
  storeLocation: string;
  storeManagerId: string; // Assuming this is a user ID
  storeStatus: boolean;
}

// Function to handle the POST request
export async function POST(req: Request) {
  try {
    // Parse the body of the request
    const body: AddStoreRequestBody = await req.json();
    const { storeName, storeLocation, storeManagerId, storeStatus } = body;

    // Validation (add your own logic as needed)
    if (!storeName || !storeLocation || !storeManagerId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Ensure the partition exists for the store manager
    await db.$executeRaw`SELECT check_and_create_store_partition(${storeManagerId});`;

    // Create a new store record
    const store = await db.store.create({
      data: {
        storeName,
        storeLocation,
        storeManagerId,
        storeStatus,
        createdAt: new Date(), // Automatically set the created timestamp
      },
    });

    // Return the newly created store data
    return NextResponse.json(
      { message: `Store ${store.storeName} added successfully`, store },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding store:", err);
    return NextResponse.json(
      { error: "An error occurred while adding the store" },
      { status: 500 }
    );
  }
}

// fetching stores for specific manager only
// endpoint -- http://localhost:3000/api/management/stores?storeManagerID=${IDhere}
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

    const stores_for_manager = await db.store.findMany({
      where: {
        storeManagerId: storeManagerID,
      },
    });

    if (stores_for_manager.length === 0) {
      return NextResponse.json(
        {
          message: "No stores available for this manager.",
          store_data: stores_for_manager,
        },
        {
          status: 200, // Change this to 200 to allow a body
        }
      );
    }

    // Return the stores if found
    return NextResponse.json(
      {
        message: "Data retrieved successfully",
        stores_for_manager,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.log("Error fetching stores for manager");
    const errMessage =
      err instanceof Error ? err.message : "An unknown error occured";
    return NextResponse.json(
      {
        error: `An error occured while fetching store_data for manager: ${errMessage}`,
      },
      { status: 500 }
    );
  }
}
