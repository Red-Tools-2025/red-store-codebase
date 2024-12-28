import { NextResponse } from "next/server";
import supabase from "../../../../../../../supabase/client";

export async function GET(req: Request) {
  try {
    // Parse the store_id from the query parameters
    const url = new URL(req.url);
    const store_id = parseInt(url.searchParams.get("store_id") || "0", 10);

    // Validate the store_id input
    if (!store_id || isNaN(store_id)) {
      return NextResponse.json(
        { error: "Invalid or missing store_id parameter" },
        { status: 400 }
      );
    }

    // Call the Supabase RPC function with store_id as an argument
    const { data, error } = await supabase.rpc(
      "calculate_monthly_transaction_metrics", // RPC function name
      {
        store_id_input: store_id, // Pass the store_id as input
      }
    );

    // Handle errors from Supabase
    if (error) {
      console.error("Error calling RPC:", error.message);
      return NextResponse.json(
        { error: "Error fetching transaction metrics" },
        { status: 500 }
      );
    }

    // Return the data from the RPC function
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
