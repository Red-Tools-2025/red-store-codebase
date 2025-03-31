/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inventory } from "@prisma/client";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

interface InventoryTableHookProps {
  data: Inventory[];
  columns: ColumnDef<Inventory>[];
}
import { getPaginationRowModel } from "@tanstack/react-table";
const useInventoryTableHook = ({ columns, data }: InventoryTableHookProps) => {
  // const betweenFilter: FilterFn<any> = (row, columnId, filterValue) => {
  //   const [min, max] = filterValue;
  //   const value = row.getValue(columnId) as number;
  //   return value >= min && value <= max;
  // };

  const [sorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // const [isLoading, setIsLoading] = useState(false); //

  const [pagination, setPagination] = useState({
    pageIndex: 0, // Default to first page (0-based index)
    pageSize: 10, // Default page size
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(), //
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onPaginationChange: setPagination, //
  });

  console.log({ columns, columnFilters });

  const totalPages = table.getPageCount();

  return { table, sorting, columnFilters, setColumnFilters, totalPages };
};

export default useInventoryTableHook;
