import { Bucket, Inventory } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { LiaEdit } from "react-icons/lia";
import { MdDeleteOutline } from "react-icons/md";
import { ImSwitch } from "react-icons/im";
import { format } from "date-fns";

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
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === "ACTIVE"
              ? "default"
              : status === "COMPLETED"
              ? "outline"
              : "destructive"
          }
        >
          {status}
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
      return scheduledTime
        ? format(new Date(scheduledTime), "PPp")
        : "Not Scheduled";
    },
  },
  //   {
  //     accessorKey: "soldQty",
  //     header: "Sold Quantity",
  //     cell: ({ row }) => `${row.getValue("soldOty")}`,
  //   },
  {
    accessorKey: "row_actions",
    header: "Actions",
    cell: ({ row }) => {
      const isCompleted = row.original.status === "COMPLETED";

      return (
        <div className="flex flex-row gap-2 items-center">
          <ImSwitch
            className={`h-4 w-4 transition-all ${
              isCompleted
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-blue-500 cursor-pointer "
            }`}
          />
          <LiaEdit
            className={`h-5 w-5 transition-all ${
              isCompleted
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-blue-500 cursor-pointer"
            }`}
          />
          <MdDeleteOutline className="h-5 w-5 hover:text-red-500 cursor-pointer transition-all" />
        </div>
      );
    },
  },
];
