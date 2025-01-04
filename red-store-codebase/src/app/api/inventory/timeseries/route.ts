import { NextResponse } from "next/server";
import supabase from "../../../../../supabase/client";

export async function GET(req: Request) {
  try {
    // Parse query parameters from the URL
    const url = new URL(req.url);
    const store_id = parseInt(url.searchParams.get("store_id") || "0", 10);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    // Parse query params for pagination
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "15", 10); // displaying 15 records per page

    const offset = (page - 1) * pageSize;

    // Query Supabase
    const { data, error, count } = await supabase
      .from("inventory_timeseries")
      .select("*", { count: "exact" })
      .eq("store_id", store_id)
      .gte("time", startDate)
      .lte("time", endDate)
      .range(offset, offset + pageSize - 1); // LIMIT and OFFSET

    if (error) {
      console.error("Error fetching data:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const totalPageCount = Math.ceil(count! / pageSize);

    if (page > totalPageCount)
      return NextResponse.json(
        {
          error: `Page Range out of index, total pages available - ${totalPageCount}`,
        },
        { status: 400 }
      );

    if (data && data.length === 0)
      return NextResponse.json(
        {
          error: `Data not available for month range between ${startDate} & ${endDate}`,
        },
        { status: 404 }
      );

    // Return the fetched data
    return NextResponse.json(
      {
        data,
        total_pages: totalPageCount,
        current_page: page,
        items_per_page: pageSize,
        total_count: count,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
