import { Bucket, Inventory } from "@prisma/client";
import React, { useState } from "react";
import { BucketDataTableColumns } from "./BucketDataTableColumns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import useBucketTableHook from "@/app/hooks/pos/StaticHooks/useBucketsTableHook";
import BucketSearch from "./BucketSearch";

/* Table props to resemble fetched UI on response */
interface BucketTableProps {
  buckets: (Bucket & { inventory: Inventory | null })[];
}

const BucketTable: React.FC<BucketTableProps> = ({ buckets }) => {
  const { table, setColumnFilters } = useBucketTableHook({
    columns: BucketDataTableColumns,
    data: buckets,
  });

  const setSearchFilter = (value: string) => {
    setColumnFilters([{ id: "product", value }]);
  };

  /* Dynamic Table render, via created tanstack table */
  return (
    <div className="flex flex-col gap-2">
      <BucketSearch setSearchFilter={setSearchFilter} />
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
    </div>
  );
};

export default BucketTable;
