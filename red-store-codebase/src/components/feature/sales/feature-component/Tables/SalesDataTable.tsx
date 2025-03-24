import { TableCell } from "@/components/ui/table";
import TableLayout from "@/components/feature/management/layouts/TableLayout";
import { useMemo } from "react";
import { motion } from "framer-motion";

// Helper function to format numbers with commas
const formatNumberWithCommas = (
  num: number | undefined | null,
  fixed: number = 0
) => {
  if (num === null || num === undefined || isNaN(num)) {
    return "-"; // Return a fallback value if the number is invalid
  }
  const formattedNumber = num.toFixed(fixed); // Ensure we respect decimal places
  return new Intl.NumberFormat().format(Number(formattedNumber)); // Format number with commas
};

interface SalesDataTableProps {
  salesData: {
    time: string;
    store_id: number;
    product_id: number;
    opening_stock: number;
    received_stock: number;
    closing_stock: number;
    sales: number;
    mrp_per_bottle: string;
    sale_amount: string;
    product_name?: string;
  }[];
  startDate: string;
  endDate: string;
}

interface SaleRecord {
  time: string;
  store_id: number;
  product_id: number;
  opening_stock: number;
  received_stock: number;
  closing_stock: number;
  sales: number;
  mrp_per_bottle: number;
  sale_amount: number;
  product_name?: string;
}

const SalesDataTable: React.FC<SalesDataTableProps> = ({
  salesData,
  startDate,
  endDate,
}) => {
  const headers = [
    "ID #",
    "Product",
    "Opening Stock",
    "Received Stock",
    "Closing Stock",
    "Sales",
    "MRP per Bottle",
    "Sale Amount",
  ];

  console.log(salesData);

  const cleanedData = useMemo(() => {
    if (!salesData || salesData.length === 0) return [];

    console.log("Raw sales data:", salesData);

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    // Filter data by date range
    const filteredData = salesData.filter((entry) => {
      const entryDate = new Date(entry.time);
      return (!start || entryDate >= start) && (!end || entryDate <= end);
    });

    if (filteredData.length === 0) return [];

    console.log("Filtered data:", filteredData);

    // Group data by product_id to get distinct products
    const productMap: Map<number, SaleRecord> = new Map();

    // First pass - identify distinct products and their first record within range
    filteredData.forEach((entry) => {
      const productId = entry.product_id;

      if (!productMap.has(productId)) {
        productMap.set(productId, {
          time: entry.time,
          store_id: entry.store_id,
          product_id: productId,
          product_name: entry.product_name,
          opening_stock: 0, // We'll set this properly in the next step
          received_stock: 0,
          closing_stock: 0,
          sales: 0,
          sale_amount: 0,
          mrp_per_bottle: parseFloat(entry.mrp_per_bottle),
        });
      }
    });

    // For each product, find the earliest and latest records
    const productIds = Array.from(productMap.keys());

    productIds.forEach((productId) => {
      const productEntries = filteredData
        .filter((entry) => entry.product_id === productId)
        .sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );

      if (productEntries.length > 0) {
        const firstEntry = productEntries[0];
        const lastEntry = productEntries[productEntries.length - 1];

        // Get the product record
        const record = productMap.get(productId)!;

        // Set the opening stock from the first record
        record.opening_stock = firstEntry.opening_stock;

        // Set the closing stock from the last record
        record.closing_stock = lastEntry.closing_stock;

        // Calculate total received stock and sales across all entries
        let totalReceivedStock = 0;
        let totalSales = 0;
        let totalSaleAmount = 0;

        productEntries.forEach((entry) => {
          totalReceivedStock += entry.received_stock;
          totalSales += entry.sales;
          totalSaleAmount += parseFloat(entry.sale_amount);
        });

        record.received_stock = totalReceivedStock;
        record.sales = totalSales;
        record.sale_amount = totalSaleAmount;
      }
    });

    return Array.from(productMap.values());
  }, [salesData, startDate, endDate]);

  const tableRows = cleanedData.map((entry, index) => (
    <motion.tr
      key={index}
      className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
    >
      <TableCell className="font-inter">
        {formatNumberWithCommas(entry.product_id)}
      </TableCell>
      <TableCell className="pl-6 font-inter">{entry.product_name}</TableCell>
      <TableCell className="pl-6 font-inter">
        {formatNumberWithCommas(entry.opening_stock)}
      </TableCell>
      <TableCell className="pl-6 font-inter">
        {formatNumberWithCommas(entry.received_stock)}
      </TableCell>
      <TableCell className="pl-6 font-inter">
        {formatNumberWithCommas(entry.closing_stock)}
      </TableCell>
      <TableCell className="pl-6 font-inter">
        {formatNumberWithCommas(entry.sales)}
      </TableCell>
      <TableCell className="pl-6 font-inter">
        ₹ {formatNumberWithCommas(entry.mrp_per_bottle, 2)}
      </TableCell>
      <TableCell className="pl-6 font-inter">
        ₹ {formatNumberWithCommas(entry.sale_amount, 2)}
      </TableCell>
    </motion.tr>
  ));

  return (
    <div className="flex flex-col mt-3">
      {cleanedData.length > 0 ? (
        <TableLayout TableColumnValues={headers}>{tableRows}</TableLayout>
      ) : (
        <div className="text-center p-4 bg-red-100 text-red-700 rounded-md">
          <p>No inventory data available</p>
        </div>
      )}
    </div>
  );
};

export default SalesDataTable;
