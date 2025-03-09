import { ScheduleEntry } from "@/app/types/buckets/components";
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
    setIsCompleteBucketModalOpen: Dispatch<SetStateAction<boolean>>;

    /* Server actions */
    deleteBucket: (buckets: { bucket_id: number; store_id: number }[]) => void;
    activateBucket: (
      bucket_id: number,
      store_id: number,
      scheduled_time: string
    ) => void;
    completeBucket: (bucket_id: number, store_id: number) => void;
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
    finishedBucketId: number;
    isActivating: boolean;
    isFinishing: boolean;
    scheduleMap: Map<string, ScheduleEntry>;
  };
}
const useBucketTableHook = ({
  columns,
  data,
  tableMeta: {
    activeBucket,
    finishedBucketId,
    isActivating,
    isFinishing,
    scheduleMap,
  },
  tableActions: {
    activateBucket,
    deleteBucket,
    completeBucket,
    setDeleteIds,
    setActivationId,
    setIsActiveBucketModalOpen,
    setIsCompleteBucketModalOpen,
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

      completeBucket(bucket_id, store_id) {
        completeBucket(bucket_id, store_id);
        setIsCompleteBucketModalOpen(true);
        /* Re-using active bucket selection state */
        setActivationId({ bucket_id, store_id });
      },

      /* Boolean Holds */
      isActivatingBucketId: activeBucket?.bucket_id,
      isActivating,
      isFinishing,
      scheduleMap,
    },
  });

  return { table, setColumnFilters };
};

export default useBucketTableHook;
