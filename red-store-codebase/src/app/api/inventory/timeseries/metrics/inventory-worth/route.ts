import { NextResponse } from "next/server";
import supabase from "../../../../../../../supabase/client"; // Adjust the path based on your project structure

export async function GET(req: Request) {
  try {
    // Parse the store_id from the query parameters
    const url = new URL(req.url);
    const store_id = parseInt(url.searchParams.get("store_id") || "0", 10);

    if (!store_id) {
      return NextResponse.json(
        { error: "Invalid or missing store_id parameter" },
        { status: 400 }
      );
    }

    // Call the Supabase RPC function with store_id_input as an argument
    const { data, error } = await supabase.rpc("calculate_inventory_worth", {
      store_id_input: store_id,
    });

    if (error) {
      console.error("Error calling RPC:", error.message);
      return NextResponse.json(
        { error: "Error calculating inventory worth" },
        { status: 500 }
      );
    }

    // Return the response from the function
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
