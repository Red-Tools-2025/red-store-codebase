import { Bucket, Inventory } from "@prisma/client";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction, useState } from "react";

interface BucketTableProps {
  data: (Bucket & { inventory: Inventory | null })[];
  columns: ColumnDef<Bucket & { inventory: Inventory | null }>[];
  tableActions: {
    deleteBucket: (buckets: { bucket_id: number; store_id: number }[]) => void;
    setDeleteIds: Dispatch<
      SetStateAction<
        {
          bucket_id: number;
          store_id: number;
        }[]
      >
    >;
  };
}
const useBucketTableHook = ({
  columns,
  data,
  tableActions: { deleteBucket, setDeleteIds },
}: BucketTableProps) => {
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
    meta: {
      deleteBucket(buckets) {
        deleteBucket(buckets);
        setDeleteIds(buckets);
      },
    },
  });

  return { table, setColumnFilters };
};

export default useBucketTableHook;
