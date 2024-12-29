import { ColumnDef } from "@tanstack/react-table";
import { Inventory } from "@prisma/client";

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
    header: "Price",
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
