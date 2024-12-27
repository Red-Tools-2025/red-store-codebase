import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Adjust to your Prisma setup

interface UpdateCustomFieldsRequestBody {
  storeId: number;
  storeManagerId: string;
  customfields: {
    fieldName: string;
    label: string;
    type: string;
    // below fields are only for select type
    allowedValues?: string[];
  }[];
}

export async function POST(req: Request) {
  try {
    // Parse the body of the request
    const body: UpdateCustomFieldsRequestBody = await req.json();
    const { storeId, storeManagerId, customfields } = body;

    // Validation: Ensure required fields are present
    if (!storeId || !storeManagerId || !Array.isArray(customfields)) {
      return NextResponse.json(
        {
          error:
            "Invalid payload. storeId, storeManagerId, and customFields are required.",
        },
        { status: 400 }
      );
    }

    // Validate custom fields structure
    const isValid = customfields.every(
      (field) =>
        field.fieldName &&
        field.type &&
        (field.type !== "select" || Array.isArray(field.allowedValues))
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid custom fields structure." },
        { status: 400 }
      );
    }

    // Update the store's custom fields using the compound unique key
    const updatedStore = await db.store.update({
      where: { storeId_storeManagerId: { storeId, storeManagerId } },
      data: { customfields },
    });

    // Return the updated store data
    return NextResponse.json(
      {
        message: `Custom fields updated successfully for store ID ${storeId}.`,
        store: updatedStore,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating custom fields:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the custom fields." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Parse query parameters from the request URL
    const url = new URL(req.url);
    const storeId = url.searchParams.get("storeId");
    const storeManagerId = url.searchParams.get("storeManagerId");

    // Validate required query parameters
    if (!storeId || !storeManagerId) {
      return NextResponse.json(
        { error: "storeId and storeManagerId are required query parameters." },
        { status: 400 }
      );
    }

    // Fetch the custom fields for the specified store
    const store = await db.store.findUnique({
      where: {
        storeId_storeManagerId: { storeId: Number(storeId), storeManagerId },
      },
      select: { customfields: true },
    });

    if (!store) {
      return NextResponse.json(
        {
          error: `Store with storeId ${storeId} and storeManagerId ${storeManagerId} not found.`,
        },
        { status: 404 }
      );
    }

    // Return the custom fields
    return NextResponse.json(
      {
        message: `Custom fields retrieved successfully for store ID ${storeId}.`,
        customfields: store.customfields,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving custom fields:", error);
    return NextResponse.json(
      { error: "An error occurred while retrieving the custom fields." },
      { status: 500 }
    );
  }
}
