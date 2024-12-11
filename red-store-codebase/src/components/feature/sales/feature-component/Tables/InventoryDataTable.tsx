import { TableCell, TableRow } from "@/components/ui/table";
import TableLayout from "@/components/feature/management/layouts/TableLayout";
import { useMemo } from "react";

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

interface InventoryDataTableProps {
  inventoryData: {
    time: string;
    store_id: number;
    product_id: number;
    opening_stock: number;
    received_stock: number;
    closing_stock: number;
    sales: number;
    mrp_per_bottle: number;
    sale_amount: number;
  }[];
  startDate: string;
  endDate: string;
}

const InventoryDataTable: React.FC<InventoryDataTableProps> = ({
  inventoryData,
  startDate,
  endDate,
}) => {
  const headers = [
    "Date",
    "Product ID",
    "Opening Stock",
    "Received Stock",
    "Closing Stock",
    "Sales",
    "MRP per Bottle",
    "Sale Amount",
  ];

  const filteredData = useMemo(() => {
    if (!inventoryData) return [];

    return inventoryData.filter((entry) => {
      const entryDate = new Date(entry.time);
      const matchesStartDate =
        startDate === "" || entryDate >= new Date(startDate);
      const matchesEndDate = endDate === "" || entryDate <= new Date(endDate);

      return matchesStartDate && matchesEndDate;
    });
  }, [inventoryData, startDate, endDate]);

  const tableRows = filteredData.map((entry, index) => (
    <TableRow
      key={index}
      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"} // Alternate row colors
    >
      <TableCell className="font-semibold">
        {new Date(entry.time).toLocaleDateString()}
      </TableCell>
      <TableCell className="pl-6 font-semibold">{entry.product_id}</TableCell>
      <TableCell className="pl-6 font-semibold">
        {formatNumberWithCommas(entry.opening_stock)}
      </TableCell>
      <TableCell className="pl-6 font-semibold">
        {formatNumberWithCommas(entry.received_stock)}
      </TableCell>
      <TableCell className="pl-6 font-semibold">
        {formatNumberWithCommas(entry.closing_stock)}
      </TableCell>
      <TableCell className="pl-6 font-semibold">
        {formatNumberWithCommas(entry.sales)}
      </TableCell>
      <TableCell className="pl-6 font-semibold">
        ₹ {formatNumberWithCommas(entry.mrp_per_bottle, 2)}
      </TableCell>
      <TableCell className="pl-6 font-semibold">
        ₹ {formatNumberWithCommas(entry.sale_amount, 2)}
      </TableCell>
    </TableRow>
  ));

  return (
    <div className="flex flex-col mt-3">
      {filteredData.length > 0 ? (
        <TableLayout TableColumnValues={headers}>{tableRows}</TableLayout>
      ) : (
        <div className="text-center p-4 bg-red-100 text-red-700 rounded-md">
          <p>No inventory data available</p>
        </div>
      )}
    </div>
  );
};

export default InventoryDataTable;
