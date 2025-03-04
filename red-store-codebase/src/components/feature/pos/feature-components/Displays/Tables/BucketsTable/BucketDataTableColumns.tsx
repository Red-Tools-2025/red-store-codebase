import { Bucket, Inventory } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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
    cell: ({ row }) => {
      const invItem = row.original.inventory;
      return invItem?.invItem || "No Product Assigned";
    },
  },
  {
    accessorKey: "bucketSize",
    header: "Bucket Size",
    cell: ({ row }) => `${row.original.bucketSize} kg`,
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
          <p>Edit</p>
          <p>Delete</p>
        </div>
      );
    },
  },
];
