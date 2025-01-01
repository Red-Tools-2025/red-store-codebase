import { Inventory } from "@prisma/client";
import {
  ColumnDef,
  FilterFn,
  getCoreRowModel,
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
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    filterFns: {
      between: betweenFilter,
    },
  });

  return { table, sorting };
};

export default useInventoryTableHook;
