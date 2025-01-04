/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { parse } from "json2csv";
import supabase from "../../../../../../../supabase/client";

export async function GET(req: Request) {
  try {
    // Parse query parameters
    const url = new URL(req.url);
    const store_id = parseInt(url.searchParams.get("store_id") || "0", 10);
    const month_input = url.searchParams.get("month_input") || "";

    if (!store_id || !month_input) {
      return NextResponse.json(
        { error: "Invalid or missing store_id or month_input parameter" },
        { status: 400 }
      );
    }

    // // Parse the month_input and calculate date range
    // const startDate = dayjs(month_input).startOf("month").format("YYYY-MM-DD");
    // const endDate = dayjs(month_input).endOf("month").format("YYYY-MM-DD");

    // Call the Supabase RPC function to get the data
    const { data, error } = await supabase.rpc(
      "get_monthly_inventory_summary",
      {
        store_id_input: store_id,
        month_input,
      }
    );

    if (error) {
      console.error("Error calling RPC:", error.message);
      return NextResponse.json(
        { error: "Error fetching inventory summary" },
        { status: 500 }
      );
    }

    // Format the data for CSV
    const fields = [
      { label: "Product Name", value: "product_name" },
      { label: "Product ID", value: "product_id" },
      { label: "Opening Stock", value: "opening_stock" },
      { label: "Received Stock", value: "received_stock" },
      {
        label: "Total",
        value: (row: any) => row.opening_stock + row.received_stock,
      },
      { label: "Closing Stock", value: "closing_stock" },
      { label: "Sales", value: "sales" },
      { label: "Sale Amount", value: "sale_amount" },
      { label: "Total Value", value: "total_value" },
    ];

    // Use json2csv to convert the data into CSV format
    const csv = parse(data, { fields });

    // Create a raw Base64-encoded string of the CSV
    const csvBase64 = Buffer.from(csv, "utf-8").toString("base64");

    // Return the raw Base64 string in the API response
    return NextResponse.json({ csv: csvBase64 }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
