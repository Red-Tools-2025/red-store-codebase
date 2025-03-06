import { usePos } from "@/app/contexts/pos/PosContext";
import useBucketServerActions from "@/app/hooks/pos/ServerHooks/useBucketServerActions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React from "react";

interface ConfirmDeleteBucketModalProps {
  isOpen: boolean;
  onClose: () => void;
  deleteIds: { bucket_id: number; store_id: number }[];
}

const ConfirmDeleteBucketModal: React.FC<ConfirmDeleteBucketModalProps> = ({
  isOpen,
  onClose,
  deleteIds,
}) => {
  const {
    deleteError,
    isDeleting,
    dialogMessage,
    handleBucketDelete,
    setDialogType,
    setIsDialogOpen,
  } = useBucketServerActions();
  const { buckets } = usePos();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle>Delete Bucket</DialogTitle>
          {deleteError && (
            <p className="text-sm text-red-500 mt-1">{deleteError}</p>
          )}
          <DialogDescription>
            Are you sure you want to delete this bucket ?
          </DialogDescription>
          <div className="py-1 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Bucket Details</p>
              {deleteIds.length > 0 ? (
                <ScrollArea className="w-[450px] border-none whitespace-nowrap rounded-md border">
                  <div className="flex w-max space-x-4 pt-2">
                    {buckets
                      .filter((b) => b.bucketId === deleteIds[0]?.bucket_id)
                      .map((bucket) => (
                        <div key={bucket.bucketId} className="w-full pb-2">
                          <div className="text-sm flex flex-row items-center gap-8 py-3 border border-gray-300 border-t-1 border-b-1 border-r-0 border-l-0 whitespace-nowrap">
                            <p>{`B-#${bucket.bucketId}`}</p>
                            <p>{bucket.inventory?.invItem}</p>
                            <p className="text-xs py-1 text-black px-2 border border-gray-300 rounded-sm bg-gray-100">
                              {bucket.inventory?.invItemBrand}
                            </p>
                            <p
                              className={`px-2 py-1 rounded-md ${
                                bucket.bucketSize === "FIFTY"
                                  ? "bg-green-200 border border-green-600 text-green-600"
                                  : "bg-orange-200 border border-orange-600 text-orange-600"
                              }`}
                            >
                              {bucket.bucketSize === "FIFTY"
                                ? "Mini Bucket"
                                : "Large Bucket"}
                            </p>
                            <p
                              className={`px-3 py-1 font-medium border border-gray-300 rounded-lg ${
                                bucket.status === "ACTIVE"
                                  ? "bg-green-500 text-white"
                                  : bucket.status === "INACTIVE"
                                  ? "bg-red-500 text-white"
                                  : ""
                              }`}
                            >
                              {bucket.status}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              ) : (
                <></>
              )}
            </div>
            <p className="text-sm">
              This is an{" "}
              <span className="px-2 py-1 rounded-md bg-red-100  text-red-600">
                irreversible action
              </span>
              , are you sure you want to proceed with deleting your bucket
            </p>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteBucketModal;
