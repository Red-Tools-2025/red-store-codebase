/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import supabase from "../../../../../../lib/supabase/client";
import * as XLSX from "xlsx";
import { parse } from "json2csv";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Parse query parameters
    const url = new URL(req.url);
    const store_id = parseInt(url.searchParams.get("store_id") || "0", 10);
    const month_input = url.searchParams.get("month_input") || "";
    const date_input = url.searchParams.get("date_input") || "";
    const file_type = url.searchParams.get("file_type") || ""; // 'pdf', 'excel', or 'csv'

    // Check if we have required parameters
    if (!store_id || (!month_input && !date_input) || !file_type) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Determine whether we're using daily or monthly data
    const isDailyReport = !!date_input;

    // Parse the input date and calculate date range if needed
    let startDate, endDate;

    if (isDailyReport) {
      startDate = dayjs(date_input).format("YYYY-MM-DD");
      endDate = startDate;
    } else {
      startDate = dayjs(month_input).startOf("month").format("YYYY-MM-DD");
      endDate = dayjs(month_input).endOf("month").format("YYYY-MM-DD");
    }

    // Call the appropriate Supabase RPC function based on report type
    const rpcFunction = isDailyReport
      ? "get_daily_sales_summary"
      : "get_monthly_inventory_summary";

    const rpcParams = isDailyReport
      ? { store_id_input: store_id, date_input: date_input }
      : { store_id_input: store_id, month_input: month_input };

    // Call the Supabase RPC function to get the data
    const { data, error } = await supabase.rpc(rpcFunction, rpcParams);

    if (error) {
      console.error("Error calling RPC:", error.message);
      return NextResponse.json(
        {
          error: `Error fetching ${
            isDailyReport ? "daily" : "monthly"
          } inventory summary`,
        },
        { status: 500 }
      );
    }

    // Fetch product brand information from Prisma
    const productIds = data.map((item: any) => item.product_id);
    const inventoryItems = await prisma.inventory.findMany({
      where: {
        storeId: store_id,
        invId: {
          in: productIds,
        },
      },
      select: {
        invId: true,
        invItemBrand: true,
      },
    });

    // Create a mapping of product IDs to brands
    const brandMap = inventoryItems.reduce(
      (map: Record<number, string>, item) => {
        map[item.invId] = item.invItemBrand || "N/A";
        return map;
      },
      {}
    );

    // Merge brand information with RPC data
    const enrichedData = data.map((item: any) => ({
      ...item,
      product_brand: brandMap[item.product_id] || "N/A",
    }));

    // Headers for tables (now including brand)
    const headers = [
      "Product Name",
      "Brand",
      "Product ID",
      "Opening Stock",
      "Received Stock",
      "Total",
      "Closing Stock",
      "Sales",
      "Sale Amount",
      "Total Value",
    ];

    // Format the report based on file type
    let responseData;

    switch (file_type) {
      case "pdf":
        responseData = generatePdfReport(
          enrichedData,
          headers,
          store_id,
          startDate,
          endDate,
          isDailyReport
        );
        break;
      case "excel":
        responseData = generateExcelReport(enrichedData);
        break;
      case "csv":
        responseData = generateCsvReport(enrichedData);
        break;
      default:
        return NextResponse.json(
          {
            error:
              "Invalid file_type parameter. Must be 'pdf', 'excel', or 'csv'.",
          },
          { status: 400 }
        );
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Generate PDF report
function generatePdfReport(
  data: any[],
  headers: string[],
  storeId: number,
  startDate: string,
  endDate: string,
  isDailyReport: boolean
) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Add a title/heading to the PDF
  const dateInfo = isDailyReport
    ? `Date: ${startDate}`
    : `Month: ${startDate} to ${endDate}`;
  const heading = `Inventory Summary for Store ID: ${storeId} | ${dateInfo}`;
  doc.setFontSize(16);
  doc.text(heading, 14, 20);

  // Format the data for the table (now including brand)
  const tableData = data.map((row: any) => [
    row.product_name,
    row.product_brand,
    row.product_id,
    row.opening_stock,
    row.received_stock,
    row.total,
    row.closing_stock,
    row.sales,
    parseFloat(row.sale_amount).toFixed(2),
    parseFloat(row.total_value).toFixed(2),
  ]);

  // Add the table
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 30,
    theme: "grid",
    styles: {
      fontSize: 10,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
    },
  });

  return { pdf: doc.output("datauristring") };
}

// Generate Excel report
function generateExcelReport(data: any[]) {
  // Format data for Excel (now including brand)
  const excelData = data.map((row: any) => ({
    "Product Name": row.product_name,
    Brand: row.product_brand,
    "Product ID": row.product_id,
    "Opening Stock": row.opening_stock,
    "Received Stock": row.received_stock,
    Total: row.total,
    "Closing Stock": row.closing_stock,
    Sales: row.sales,
    "Sale Amount": parseFloat(row.sale_amount).toFixed(2),
    "Total Value": parseFloat(row.total_value).toFixed(2),
  }));

  // Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Create a workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Report");

  // Write to buffer and convert to base64
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  const excelBase64 = buffer.toString("base64");

  return { excel: excelBase64 };
}

// Generate CSV report
function generateCsvReport(data: any[]) {
  try {
    // Define fields for CSV (now including brand)
    const fields = [
      { label: "Product Name", value: "product_name" },
      { label: "Brand", value: "product_brand" },
      { label: "Product ID", value: "product_id" },
      { label: "Opening Stock", value: "opening_stock" },
      { label: "Received Stock", value: "received_stock" },
      { label: "Total", value: "total" },
      { label: "Closing Stock", value: "closing_stock" },
      { label: "Sales", value: "sales" },
      { label: "Sale Amount", value: "sale_amount" },
      { label: "Total Value", value: "total_value" },
    ];

    const csv = parse(data, { fields });
    const csvBase64 = Buffer.from(csv, "utf-8").toString("base64");
    return { csv: csvBase64 };
  } catch (error) {
    console.error("Error generating CSV:", error);
    throw error;
  }
}
