import { Bucket, Inventory } from "@prisma/client";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

import { LiaEdit } from "react-icons/lia";
import { MdDeleteOutline } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import { ImSwitch } from "react-icons/im";

/* Module for passing actions through column tables */
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    deleteBucket: (buckets: { bucket_id: number; store_id: number }[]) => void;
    activateBucket: (
      bucket_id: number,
      store_id: number,
      scheduled_time: string
    ) => void;

    /* These states will be used to convey buckets being activated on scheduled time */
    isActivating: boolean;
    isActivatingBucketId: number | undefined;
  }
}

/* Column defination for Buckets table */
export const BucketDataTableColumns: ColumnDef<
  Bucket & { inventory: Inventory | null }
>[] = [
  {
    accessorKey: "bucketId",
    header: "Bucket ID",
    cell: ({ row }) => `B-#${row.getValue("bucketId")}`,
  },
  {
    accessorFn: (row) => row.inventory?.invItem || "No Product Assigned",
    header: "Product",
    id: "product",
    cell: ({ row }) => {
      const invItem = row.original.inventory;
      return invItem?.invItem || "No Product Assigned";
    },
    filterFn: "includesString",
  },
  {
    accessorFn: (row) => row.bucketSize,
    header: "Bucket Size",
    id: "bucketSize",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-1">
          <p
            className={`text-xs py-1 px-3 rounded-md ${
              row.original.bucketSize === "FIFTY"
                ? "border border-green-600 bg-green-100 text-green-600"
                : "border border-orange-600 bg-orange-100 bg-orange-200 text-orange-600"
            }`}
          >
            {row.original.bucketSize === "FIFTY"
              ? "Mini Bucket"
              : "Large Bucket"}
          </p>
        </div>
      );
    },
    filterFn: "equalsString",
  },
  {
    accessorKey: "status",
    id: "status",
    header: "Bucket Status",
    cell: ({ row, table }) => {
      const status = row.original.status;
      const { isActivating, isActivatingBucketId } = table.options.meta || {};
      const activationInProgress =
        isActivating &&
        isActivatingBucketId &&
        row.original.bucketId === isActivatingBucketId;

      return (
        <Badge
          variant={
            activationInProgress
              ? "progress"
              : status === "ACTIVE"
              ? "default"
              : status === "COMPLETED"
              ? "outline"
              : "destructive"
          }
        >
          {activationInProgress ? "ACTIVATING..." : status}
        </Badge>
      );
    },
    filterFn: "equalsString",
  },
  {
    accessorKey: "scheduledTime",
    header: "Scheduled For",
    cell: ({ row }) => {
      const scheduledTime = row.original.scheduledTime;
      return (
        <p
          className={row.original.status === "COMPLETED" ? "line-through" : ""}
        >
          {scheduledTime
            ? format(new Date(scheduledTime), "PPp")
            : "Not Scheduled"}
        </p>
      );
    },
  },
  {
    accessorKey: "row_actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const isCompleted = row.original.status === "COMPLETED";
      const isActive = row.original.status === "ACTIVE";
      const { bucketId, storeId, scheduledTime } = row.original;

      /* Extract row actions from table meta */
      const { deleteBucket, activateBucket, isActivating } =
        table.options.meta || {};

      return (
        <div className="flex flex-row gap-2 items-center">
          {isCompleted ? (
            <MdDeleteOutline
              onClick={() =>
                deleteBucket &&
                deleteBucket([
                  {
                    bucket_id: bucketId,
                    store_id: storeId,
                  },
                ])
              }
              className="h-5 w-5 hover:text-red-500 cursor-pointer transition-all"
            />
          ) : (
            <ImSwitch
              onClick={() =>
                activateBucket &&
                activateBucket(
                  bucketId,
                  storeId,
                  scheduledTime ? scheduledTime.toString() : ""
                )
              }
              className={`h-4 w-4 transition-all ${
                isCompleted
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-blue-500 cursor-pointer "
              }`}
            />
          )}
          <LiaEdit
            className={`h-5 w-5 transition-all ${
              isCompleted
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-blue-500 cursor-pointer"
            }`}
          />
          {isCompleted || isActive ? (
            <SlOptionsVertical
              onClick={() =>
                deleteBucket &&
                deleteBucket([
                  {
                    bucket_id: bucketId,
                    store_id: storeId,
                  },
                ])
              }
              className={`${
                isActive ? "h-5 w-5 pl-2" : "h-4 w-4 pl-1"
              } hover:text-blue-500 cursor-pointer transition-all`}
            />
          ) : (
            <MdDeleteOutline
              onClick={() =>
                deleteBucket &&
                deleteBucket([
                  {
                    bucket_id: bucketId,
                    store_id: storeId,
                  },
                ])
              }
              className="h-5 w-5 hover:text-red-500 cursor-pointer transition-all"
            />
          )}
        </div>
      );
    },
  },
];
