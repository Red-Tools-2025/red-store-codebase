/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inventory } from "@prisma/client";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
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

const useInventoryTableHook = ({ columns, data }: InventoryTableHookProps) => {
  const betweenFilter: FilterFn<any> = (row, columnId, filterValue) => {
    const [min, max] = filterValue;
    const value = row.getValue(columnId) as number;
    return value >= min && value <= max;
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    filterFns: {
      between: betweenFilter,
    },
  });

  return { table, sorting, columnFilters, setColumnFilters };
};

export default useInventoryTableHook;
