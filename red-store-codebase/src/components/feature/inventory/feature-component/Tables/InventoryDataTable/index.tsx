import React, { useState, useEffect } from "react";
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
import { useInventory } from "@/app/contexts/inventory/InventoryContext";
import InventoryItemInfoPanel from "../../Panels/InventoryItemInfoPanel";

interface InventoryDataTableProps {
  table: TableType<Inventory>;
}

const InventoryDataTable: React.FC<InventoryDataTableProps> = ({ table }) => {
  const { toggleInfoPanel, infoPanelOpenState } = useInventory();
  const [inventoryItem, setInventoryItem] = useState<Inventory | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // const handleCellClick = (inventory: Inventory) => {
  //   toggleInfoPanel();
  //   setInventoryItem(inventory);
  // };

  const rows = table.getRowModel().rows;

  // loading animation when page changes
  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 500); // Simulated delay
    return () => clearTimeout(timeout);
  }, [table.getState().pagination.pageIndex]);

  return (
    <>
      {inventoryItem && (
        <InventoryItemInfoPanel
          inventoryItemDetails={inventoryItem}
          InfoPanelOpenState={infoPanelOpenState}
          toggleInfoPanel={toggleInfoPanel}
        />
      )}

      <motion.div className="w-full border border-1 border-gray-300 rounded-lg">
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <div className="flex space-x-2">
              <div className="h-2 w-2 bg-black rounded-full animate-bounce"></div>
              <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="border-b border-gray-300 p-3 font-semibold text-gray-500"
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
                      className={`border-b border-gray-200
                        ${
                          row.getIsSelected()
                            ? "bg-red-100"
                            : index % 2 === 0
                            ? "bg-gray-50"
                            : "bg-white"
                        }
                      `}
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
                <tr>
                  <td colSpan={table.getAllColumns().length}>
                    <div className="flex flex-col items-center">
                      <div className="p-5 bg-gradient-to-b from-gray-200 to-white rounded-full">
                        <GiEmptyMetalBucketHandle className="text-6xl text-gray-700" />
                      </div>
                      <div className="flex flex-col items-center mt-5">
                        <p className="text-xl font-[600] text-[#101828]">
                          Oops! Looks like we couldn&apos;t find anything
                        </p>
                        <p className="text-center font-[400] w-[450px] text-[16px] text-gray-600 mt-2">
                          Hey, there looks like you dont have any product of
                          this sort in your inventory maybe try{" "}
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
        )}
      </motion.div>
    </>
  );
};

export default InventoryDataTable;
