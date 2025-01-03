import React from "react";
import { flexRender, Table as TableType } from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import { GiEmptyMetalBucketHandle } from "react-icons/gi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Inventory } from "@prisma/client";

interface InventoryDataTableProps {
  table: TableType<Inventory>;
}

const InventoryDataTable: React.FC<InventoryDataTableProps> = ({ table }) => {
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const rows = table.getRowModel().rows;

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={listVariants}
        className="w-full border border-gray-200"
      >
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
            {rows.length > 0 ? (
              <AnimatePresence>
                {rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={rowVariants}
                    className={`border-b border-gray-200 hover:bg-green-100 cursor-pointer ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            ) : (
              // "Oops" message when no rows are found
              <tr>
                <td colSpan={table.getAllColumns().length}>
                  <div className="flex flex-col items-center">
                    <div className="p-5 bg-gradient-to-b from-gray-200 to-white rounded-full">
                      <GiEmptyMetalBucketHandle className="text-6xl text-gray-700" />
                    </div>
                    <div className="flex flex-col items-center mt-5">
                      <p className="text-xl font-[600] text-[#101828]">
                        Oops! Looks like we couldn't find anything
                      </p>
                      <p className="text-center font-[400] w-[450px] text-[16px] text-gray-600 mt-2">
                        Hey, there looks like you dont have any product of this
                        sort in your inventory maybe try{" "}
                        <span className="underline decoration-gray-600">
                          changing your filters or searching
                        </span>
                        , for something else.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </motion.div>
    </>
  );
};

export default InventoryDataTable;
