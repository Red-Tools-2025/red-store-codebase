import { NextResponse } from "next/server";
import supabase from "../../../../../../lib/supabase/client";

export async function GET(req: Request) {
  try {
    // Parse the store_id from the query parameters
    const url = new URL(req.url);
    const store_id = parseInt(url.searchParams.get("store_id") || "0", 10);

    // Check if store_id is provided and valid
    if (!store_id) {
      return NextResponse.json(
        { error: "Invalid or missing store_id" },
        { status: 400 }
      );
    }

    // Call the Supabase RPC function `get_available_years_and_months` with store_id_input
    const { data, error } = await supabase.rpc(
      "get_available_years_and_months",
      {
        store_id_input: store_id,
      }
    );

    if (error) {
      console.error("Error calling RPC:", error.message);
      return NextResponse.json(
        { error: "Error fetching data from the function" },
        { status: 500 }
      );
    }

    // Return the data in the expected format
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
