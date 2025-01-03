import { ColumnDef } from "@tanstack/react-table";
import { Inventory } from "@prisma/client";
import { ArrowUpDown } from "lucide-react";

export const InventoryDataTableColumns: ColumnDef<Inventory>[] = [
  {
    accessorKey: "invId",
    header: "ID",
    cell: ({ row }) => `#${row.getValue("invId")}`,
  },
  {
    accessorKey: "invItem",
    header: "Product",
  },
  {
    accessorKey: "invItemBrand",
    header: "Brand",
    filterFn: "includesString",
  },
  {
    accessorKey: "invItemType",
    header: "Type",
  },
  {
    accessorKey: "invItemStock",
    header: "Quantity",
    cell: ({ row }) => row.getValue("invItemStock"),
  },
  {
    accessorKey: "invItemPrice",
    header: ({ column }) => {
      return (
        <div className="flex gap-1">
          <p>Price</p>
          <ArrowUpDown
            onClick={() => {
              // If already sorted in desc, clear sorting; otherwise, sort desc
              const isDesc = column.getIsSorted() === "desc";
              column.toggleSorting(!isDesc);
            }}
            className={`h-4 w-4 cursor-pointer hover:text-blue-500 ${
              column.getIsSorted() ? "text-blue-500" : ""
            }`}
          />
        </div>
      );
    },
    cell: ({ row }) => `₹${row.getValue("invItemPrice")}`,
  },
  //   {
  //     accessorKey: "invAdditional",
  //     header: "Additional Info",
  //     cell: ({ row }) => {
  //       const additionalInfo = row.getValue("invAdditional") as Record<
  //         string,
  //         unknown
  //       >;
  //       return additionalInfo
  //         ? `Size: ${additionalInfo.size ?? ""}, Measurement: ${
  //             additionalInfo.measurement ?? ""
  //           }`
  //         : "N/A";
  //     },
  //   },
];
