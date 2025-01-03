import { NextResponse } from "next/server";
import supabase from "../../../../../../../supabase/client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

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
    const startDate = dayjs(month_input).startOf("month").format("YYYY-MM-DD");
    const endDate = dayjs(month_input).endOf("month").format("YYYY-MM-DD");

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

    // Generate PDF using jsPDF and autoTable
    const doc = new jsPDF({
      orientation: "landscape", // Set orientation to landscape
      unit: "mm",
      format: "a4", // Set paper size to A4
    });

    // Add a title/heading to the PDF with the full date range
    const heading = `Inventory Summary for Store ID: ${store_id} | Month: ${startDate} to ${endDate}`;
    doc.setFontSize(16);
    doc.text(heading, 14, 20); // Position the heading on the PDF

    // Define the headers for the table
    const headers = [
      [
        "Product Name",
        "Product ID",
        "Opening Stock",
        "Received Stock",
        "Total", // New Total field
        "Closing Stock",
        "Sales",
        "Sale Amount",
        "Total Value",
      ],
    ];

    // Map the data into rows for the table
    const tableData = (data || []).map((row: any) => [
      row.product_name,
      row.product_id,
      row.opening_stock,
      row.received_stock,
      row.opening_stock + row.received_stock, // Calculate Total field
      row.closing_stock,
      row.sales,
      parseFloat(row.sale_amount).toFixed(2), // Format numbers to 2 decimal places
      parseFloat(row.total_value).toFixed(2),
    ]);

    // Add the table using autoTable
    autoTable(doc, {
      head: headers,
      body: tableData,
      startY: 30, // Position the table below the heading
      theme: "grid", // Use a grid theme
      styles: {
        fontSize: 10, // Set the font size for table content
      },
      headStyles: {
        fillColor: [41, 128, 185], // Set the header background color
        textColor: [255, 255, 255], // Set the header text color
      },
    });

    // Generate a Base64 string from the PDF
    const pdfBase64 = doc.output("datauristring");

    // Return the Base64 PDF in the API response
    return NextResponse.json({ pdf: pdfBase64 }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
