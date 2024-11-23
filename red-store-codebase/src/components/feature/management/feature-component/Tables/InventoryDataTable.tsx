import { TableCell, TableRow } from "@/components/ui/table";
import TableLayout from "../../layouts/TableLayout";
import { useMemo } from "react";

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
    <TableRow key={index}>
      <TableCell>{new Date(entry.time).toLocaleDateString()}</TableCell>
      <TableCell>{entry.product_id}</TableCell>
      <TableCell>{entry.opening_stock}</TableCell>
      <TableCell>{entry.received_stock}</TableCell>
      <TableCell>{entry.closing_stock}</TableCell>
      <TableCell>{entry.sales}</TableCell>
      <TableCell>{entry.mrp_per_bottle.toFixed(2)}</TableCell>
      <TableCell>{entry.sale_amount.toFixed(2)}</TableCell>
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
