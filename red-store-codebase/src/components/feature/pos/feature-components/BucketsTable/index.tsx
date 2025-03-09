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
import BucketDisplayControl from "../Panels/BucketDisplayControl";
import useBucketServerActions from "@/app/hooks/pos/ServerHooks/useBucketServerActions";
import ConfirmDeleteBucketModal from "../Modals/ConfirmDeleteBucketModal";
import ConfirmActivateBucketModal from "../Modals/ConfirmActivationModal";
import ActiveBucketModal from "../Modals/ActiveBucketModal";
import ConfirmCompletionBucketModal from "../Modals/ConfirmCompletionModal";
import { usePos } from "@/app/contexts/pos/PosContext";

/* Table props to resemble fetched UI on response */
interface BucketTableProps {
  buckets: (Bucket & { inventory: Inventory | null })[];
}

const BucketTable: React.FC<BucketTableProps> = ({ buckets }) => {
  /* States for interaction modals*/
  const [isActiveBucketModalOpen, setIsActiveBucketModalOpen] =
    useState<boolean>(false);
  const [isCompleteBucketModalOpen, setIsCompleteBucketModalOpen] =
    useState<boolean>(false);
  const [finishedBucketId, setFinishedBucketId] = useState<number>(0);

  /* States for passing information about selected row items*/
  const [deleteIds, setDeleteIds] = useState<
    { bucket_id: number; store_id: number }[]
  >([]);
  const [activationId, setActivationId] = useState<{
    bucket_id: number;
    store_id: number;
  } | null>(null);

  const {
    handleAwaitDelete,
    handleAwaitActivate,
    handleAwaitComplete,
    setIsDialogOpen,
    dialogType,
    isDialogOpen,
    isActivating,
    isFinishing,
  } = useBucketServerActions();
  const { scheduleMap } = usePos();

  const { table, setColumnFilters } = useBucketTableHook({
    columns: BucketDataTableColumns,
    data: buckets,
    tableActions: {
      deleteBucket: handleAwaitDelete,
      activateBucket: handleAwaitActivate,
      completeBucket: handleAwaitComplete,
      setActivationId,
      setDeleteIds,
      setIsActiveBucketModalOpen,
      setIsCompleteBucketModalOpen,
    },
    tableMeta: {
      scheduleMap: scheduleMap,
      activeBucket: activationId,
      finishedBucketId: finishedBucketId,
      isActivating: isActivating,
      isFinishing: isFinishing,
    },
  });

  const setSearchFilter = (value: string) => {
    setColumnFilters([{ id: "product", value }]);
  };

  /* Dynamic Table render, via created tanstack table */
  return (
    <div className="flex flex-col gap-2">
      {/* Interaction Modals */}
      <ActiveBucketModal
        activateId={activationId}
        isOpen={isActiveBucketModalOpen}
        onClose={() => setIsActiveBucketModalOpen(false)}
      />
      {/* Verification Modals */}
      <ConfirmDeleteBucketModal
        isOpen={dialogType === "DELETE" && isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        deleteIds={deleteIds}
      />
      <ConfirmActivateBucketModal
        setIsFinishedBucketId={setFinishedBucketId}
        isOpen={dialogType === "ACTIVATE" && isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        activateId={activationId}
      />
      <ConfirmCompletionBucketModal
        isOpen={dialogType === "COMPLETE" && isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        activateId={activationId}
      />
      <div className="flex flex-row gap-2">
        <BucketSearch setSearchFilter={setSearchFilter} />
        <BucketDisplayControl setColumnFilters={setColumnFilters} />
      </div>
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
