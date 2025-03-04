import { Bucket, Inventory } from "@prisma/client";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

interface BucketTableProps {
  data: (Bucket & { inventory: Inventory | null })[];
  columns: ColumnDef<Bucket & { inventory: Inventory | null }>[];
}
const useBucketTableHook = ({ columns, data }: BucketTableProps) => {
  /* Table UI Interactions */
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return { table, setColumnFilters };
};

export default useBucketTableHook;
