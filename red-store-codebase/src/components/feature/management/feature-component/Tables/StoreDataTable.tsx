import { TableCell, TableRow } from "@/components/ui/table";
import { Store } from "@prisma/client";
import TableLayout from "../../layouts/TableLayout";
import { useMemo } from "react";

interface StoreDataTableProps {
  storeData: Store[] | null;
  searchValue: string;
  locationFilterValue: string;
  statusFilterValue: string;
}

const StoreDataTable: React.FC<StoreDataTableProps> = ({
  storeData,
  searchValue,
  locationFilterValue,
  statusFilterValue,
}) => {
  const headers: string[] = [
    "Store ID",
    "Store Name",
    "Location",
    "Store Status",
  ];

  // Handle all filtering in one place with useMemo
  const filteredData = useMemo(() => {
    if (!storeData) return null;

    let filtered = storeData;

    // Apply search filter
    if (searchValue && searchValue.trim() !== "") {
      const searchValueLower = searchValue.toLowerCase();
      filtered = filtered.filter((store) => {
        const storeName = store.storeName.toLowerCase();
        return storeName.includes(searchValueLower);
      });
    }

    // Apply location filter - only filter if not "All"
    if (locationFilterValue !== "All") {
      filtered = filtered.filter(
        (store) => store.storeLocation === locationFilterValue
      );
    }

    return filtered;
  }, [storeData, searchValue, locationFilterValue]);

  // Map directly to table rows without additional filtering
  const tableRows = filteredData
    ?.filter((store) =>
      statusFilterValue === "active"
        ? store.storeStatus === true
        : statusFilterValue === "inactive"
        ? store.storeStatus === false
        : store.storeStatus === true || false
    )
    .map((store, index) => (
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
    <div className="flex flex-col mt-3">
      {filteredData && filteredData.length > 0 ? (
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
