/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import supabase from "../../../../../../lib/supabase/client";
import * as XLSX from "xlsx";

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

    // Parse the month_input and calculate date range
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

    // Convert data to a format suitable for Excel
    const excelData = data.map((row: any) => ({
      "Product Name": row.product_name,
      "Product ID": row.product_id,
      "Opening Stock": row.opening_stock,
      "Received Stock": row.received_stock,
      Total: row.opening_stock + row.received_stock,
      "Closing Stock": row.closing_stock,
      Sales: row.sales,
      "Sale Amount": row.sale_amount,
      "Total Value": row.total_value,
    }));

    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Report");

    // Write the workbook to a buffer
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Create a Base64-encoded string of the Excel file
    const excelBase64 = buffer.toString("base64");

    // Return the raw Base64 string in the API response
    return NextResponse.json({ excel: excelBase64 }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
