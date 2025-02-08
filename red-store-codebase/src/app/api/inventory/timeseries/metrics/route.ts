import { NextResponse } from "next/server";
import supabase from "../../../../../lib/supabase/client";

export async function GET(req: Request) {
  try {
    // Parse the store_id from the query parameters
    const url = new URL(req.url);
    const store_id = parseInt(url.searchParams.get("store_id") || "0", 10);
    // Call the Supabase RPC function with store_id as an argument
    const { data, error } = await supabase.rpc("get_sales_averages", {
      store_id_input: store_id,
    }); // Assuming your function is named "calculate_average_sales"
    if (error) {
      console.error("Error calling RPC:", error.message);
      return NextResponse.json(
        { error: "Error calculating metrics" },
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
