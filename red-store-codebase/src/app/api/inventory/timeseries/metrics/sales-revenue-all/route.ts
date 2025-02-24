import { NextResponse } from "next/server";
import supabase from "../../../../../../lib/supabase/client";

export async function GET(req: Request) {
  try {
    // Parse the store_id, year_input, and month_input from the query parameters
    const url = new URL(req.url);
    const store_id = parseInt(url.searchParams.get("store_id") || "0", 10);
    const year_input = parseInt(url.searchParams.get("year") || "0", 10);
    const month_input = parseInt(url.searchParams.get("month") || "0", 10);

    if (!store_id || !year_input || !month_input) {
      return NextResponse.json(
        { error: "Invalid or missing parameters (store_id, year, month)" },
        { status: 400 }
      );
    }

    // Call the Supabase RPC function with store_id, year_input, and month_input as arguments
    const { data, error } = await supabase.rpc("calculate_store_revenue", {
      store_id_input: store_id,
      year_input: year_input,
      month_input: month_input,
    });

    if (error) {
      console.error("Error calling RPC:", error.message);
      return NextResponse.json(
        { error: "Error fetching store revenue data" },
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
