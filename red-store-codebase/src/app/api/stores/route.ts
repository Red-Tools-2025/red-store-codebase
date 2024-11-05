import { NextResponse } from "next/server";
import { db } from "../../../lib/prisma"; // Adjust the import path based on your project structure

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
