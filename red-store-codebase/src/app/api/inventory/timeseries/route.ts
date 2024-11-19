import { NextResponse } from "next/server";
import supabase from "../../../../../supabase/client";

export async function GET(req: Request) {
  try {
    const { data, error } = await supabase
      .from("inventory_timeseries")
      .select("*");

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
