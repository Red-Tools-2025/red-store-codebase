import { Bucket, Inventory } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { LiaEdit } from "react-icons/lia";
import { MdDeleteOutline } from "react-icons/md";
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
    accessorKey: "product",
    header: "Product",
    id: "product",
    cell: ({ row }) => {
      const invItem = row.original.inventory;
      return invItem?.invItem || "No Product Assigned";
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "bucketSize",
    header: "Bucket Size",
    cell: ({ row }) => `${row.original.bucketSize}`,
  },
  {
    accessorKey: "status",
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
      return (
        <div className="flex flex-row gap-2">
          <LiaEdit className="h-5 w-5 hover:text-blue-500 cursor-pointer transition-all" />
          <MdDeleteOutline className="h-5 w-5 hover:text-blue-500 cursor-pointer transition-all" />
        </div>
      );
    },
  },
];
