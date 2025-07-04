import { ColumnDef } from "@tanstack/react-table";
import { Inventory } from "@prisma/client";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dispatch, SetStateAction } from "react";

export const InventoryDataTableColumns = (
  setSelectedProduct: Dispatch<SetStateAction<Inventory | null>>,
  setEditModalOpen: Dispatch<SetStateAction<boolean>>
): ColumnDef<Inventory>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div className="flex items-center gap-4">
          <Pencil
            onClick={() => {
              setSelectedProduct(item);
              setEditModalOpen(true);
            }}
            className="w-4 h-4 cursor-pointer"
          />
          <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
          <MoreHorizontal className="w-4 h-4 cursort-pointer" />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
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
