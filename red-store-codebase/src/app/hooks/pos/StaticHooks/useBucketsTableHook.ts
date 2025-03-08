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
    /* Modal actions */
    setIsActiveBucketModalOpen: Dispatch<SetStateAction<boolean>>;

    /* Server actions */
    deleteBucket: (buckets: { bucket_id: number; store_id: number }[]) => void;
    activateBucket: (
      bucket_id: number,
      store_id: number,
      scheduled_time: string
    ) => void;
    setActivationId: Dispatch<
      SetStateAction<{
        bucket_id: number;
        store_id: number;
      } | null>
    >;
    setDeleteIds: Dispatch<
      SetStateAction<
        {
          bucket_id: number;
          store_id: number;
        }[]
      >
    >;
  };

  tableMeta: {
    activeBucket: {
      bucket_id: number;
      store_id: number;
    } | null;
    isActivating: boolean;
  };
}
const useBucketTableHook = ({
  columns,
  data,
  tableMeta: { activeBucket, isActivating },
  tableActions: {
    activateBucket,
    deleteBucket,
    setIsActiveBucketModalOpen,
    setDeleteIds,
    setActivationId,
  },
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
      activateBucket(bucket_id, store_id, scheduled_time) {
        activateBucket(bucket_id, store_id, scheduled_time);
        setActivationId({ bucket_id, store_id });
      },
      setIsActiveBucketModalOpen(bucket_id, store_id) {
        setIsActiveBucketModalOpen(true);
        /* Re-using active bucket selection state */
        setActivationId({ bucket_id, store_id });
      },

      /* Boolean Holds */
      isActivating: isActivating,
      isActivatingBucketId: activeBucket?.bucket_id,
    },
  });

  return { table, setColumnFilters };
};

export default useBucketTableHook;
