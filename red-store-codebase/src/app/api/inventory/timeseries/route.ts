import { NextResponse } from "next/server";
import supabase from "../../../../../supabase/client";

export async function GET(req: Request) {
  try {
    // Parse query parameters from the URL
    const url = new URL(req.url);
    const store_id = parseInt(url.searchParams.get("store_id") || "0", 10);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    // Convert dates to ISO format for querying (ensure timestamps are valid)

    // Query Supabase
    const { data, error } = await supabase
      .from("inventory_timeseries")
      .select("*")
      .eq("store_id", store_id)
      .gte("time", startDate)
      .lte("time", endDate);

    if (error) {
      console.error("Error fetching data:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return the fetched data
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
