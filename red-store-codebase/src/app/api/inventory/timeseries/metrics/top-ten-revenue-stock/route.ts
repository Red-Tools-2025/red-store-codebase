import { NextResponse } from "next/server";
import supabase from "../../../../../../../supabase/client";

export async function GET(req: Request) {
  try {
    // Parse query parameters
    const url = new URL(req.url);
    const store_id = parseInt(url.searchParams.get("store_id_input") || "0", 10);

    // Validate the store_id_input parameter
    if (!store_id || isNaN(store_id)) {
      return NextResponse.json(
        { error: "Invalid or missing store_id_input parameter" },
        { status: 400 }
      );
    }

    // Call the Supabase RPC function with the store_id_input parameter
    const { data, error } = await supabase.rpc(
      "get_top_10_best_selling_products_by_revenue_stock_status",
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
