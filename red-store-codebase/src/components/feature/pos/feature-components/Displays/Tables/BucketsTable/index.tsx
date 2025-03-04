import { Bucket, Inventory } from "@prisma/client";
import React from "react";
import { BucketDataTableColumns } from "./BucketDataTableColumns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Use the UI table components here
import { flexRender } from "@tanstack/react-table";
import useBucketTableHook from "@/app/hooks/pos/StaticHooks/useBucketsTableHook";

interface BucketTableProps {
  buckets: (Bucket & { inventory: Inventory | null })[];
}

const BucketTable: React.FC<BucketTableProps> = ({ buckets }) => {
  const { table } = useBucketTableHook({
    columns: BucketDataTableColumns,
    data: buckets,
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="border-b border-gray-200 p-3 font-semibold text-gray-500"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BucketTable;
