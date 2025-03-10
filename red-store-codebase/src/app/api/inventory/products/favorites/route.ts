import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Ensure correct path

// Interface for the request body
interface AddFavoriteRequestBody {
  storeid: number;
  storemanagerid: string;
  invid: number;
  invitem: string;
  invitembrand?: string;
}

// Function to handle the POST request
export async function POST(req: Request) {
  try {
    // Parse request body
    const body: AddFavoriteRequestBody = await req.json();
    const { storeid, storemanagerid, invid, invitem, invitembrand } = body;

    // Validate required fields
    if (!storeid || !storemanagerid || !invid || !invitem) {
      return NextResponse.json(
        { error: "storeid, storemanagerid, invid, and invitem are required" },
        { status: 400 }
      );
    }

    // Ensure partition exists before inserting (if applicable)
    await db.$executeRawUnsafe(
      `SELECT check_and_create_favorites_partition(${storeid})`
    );

    // Insert into favorites table
    const favorite = await db.favorites.create({
      data: {
        storeid,
        storemanagerid,
        invid,
        invitem,
        invitembrand,
        addedat: new Date(),
      },
    });

    // Return success response
    return NextResponse.json(
      { message: `Item ${favorite.invitem} added to favorites`, favorite },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding favorite:", err);
    return NextResponse.json(
      { error: "An error occurred while adding the favorite" },
      { status: 500 }
    );
  }
}


