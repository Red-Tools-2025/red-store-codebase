import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Store } from "@prisma/client";
import TableLayout from "../../layouts/TableLayout";

interface StoreDataTableProps {
  storeData: Store[] | null;
}

const StoreDataTable: React.FC<StoreDataTableProps> = ({ storeData }) => {
  // Define the headers for the table
  const headers: string[] = [
    "Store ID",
    "Store Name",
    "Location",
    "Store Status",
  ];

  // Map the store data into the format expected by TableLayout, always ensure to use Table rows
  const tableRows = storeData?.map((store, index) => (
    <TableRow key={index}>
      <TableCell className="w-auto">{store.storeId}</TableCell>
      <TableCell className="w-auto">{store.storeName}</TableCell>
      <TableCell className="w-auto">{store.storeLocation}</TableCell>
      <TableCell className="w-auto">
        {store.storeStatus ? (
          <p className="bg-green-100 text-green-600 font-semibold inline-block w-auto px-3 py-1 rounded-sm">
            Active
          </p>
        ) : (
          <p>Inactive</p>
        )}
      </TableCell>
    </TableRow>
  ));

  return (
    <div className="flex w-1/2 p-4 flex-col">
      <h1 className="text-lg font-semibold mb-2">Store Data</h1>
      {storeData && storeData.length > 0 ? (
        <TableLayout TableColumnValues={headers}>{tableRows}</TableLayout>
      ) : (
        <div className="text-center p-4 bg-red-100 text-red-700 rounded-md">
          <p>No store data available</p>
        </div>
      )}
    </div>
  );
};

export default StoreDataTable;
