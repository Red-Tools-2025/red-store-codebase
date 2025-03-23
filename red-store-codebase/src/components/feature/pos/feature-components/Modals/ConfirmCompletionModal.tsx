import { usePos } from "@/app/contexts/pos/PosContext";
import useBucketServerActions from "@/app/hooks/pos/ServerHooks/useBucketServerActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";

interface ConfirmCompletionBucketModalProps {
  isOpen: boolean;
  onClose: () => void;
  activateId: {
    bucket_id: number;
    store_id: number;
  } | null;
}

const ConfirmCompletionBucketModal: React.FC<
  ConfirmCompletionBucketModalProps
> = ({ isOpen, activateId, onClose }) => {
  const { handleRefreshBuckets, bucketMap, handleResync, inventoryItems } =
    usePos();
  const { handleComplete, isCompleting, completionError } =
    useBucketServerActions();

  const [remainingQty, setRemainingQty] = useState<number | null>(null);
  const [fieldError, setFieldError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (value < 0) {
      setFieldError("Quantity cannot be negative.");
    } else {
      setFieldError(""); // Clear error when value is valid
    }

    setRemainingQty(value);
  };
  const bucket = activateId ? bucketMap.get(activateId.bucket_id) : undefined;
  const inventoryItem = inventoryItems?.find(
    (item) => item.invId === bucket?.invId
  );

  const processCompletion = async () => {
    if (activateId && remainingQty !== null && remainingQty >= 0) {
      await handleComplete(
        activateId.bucket_id,
        activateId.store_id,
        remainingQty,
        inventoryItem ?? null
      );
      handleRefreshBuckets();
      handleResync();
      onClose();
    }
  };

  const details = activateId ? bucketMap.get(activateId.bucket_id) : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle>Bucket Completion</DialogTitle>
          {completionError && (
            <p className="text-sm text-red-500 mt-1">{completionError}</p>
          )}
          <DialogDescription>
            Your bucket has finished 🥳, Please verify through a physical count
            if there are any remaining bottles that may have not been sold.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {details ? (
            <ScrollArea className="w-[450px] border-none whitespace-nowrap rounded-md border">
              <ScrollBar orientation="horizontal" />
              <div className="flex w-max space-x-4 pt-2">
                <div key={details.bucketId} className="w-full pb-2">
                  <div className="text-sm flex flex-row items-center gap-8 py-3 border border-gray-300 border-t-1 border-b-1 border-r-0 border-l-0 whitespace-nowrap">
                    <p>{`B-#${details.bucketId}`}</p>
                    <p>{details.inventory?.invItem}</p>
                    <p className="text-xs py-1 text-black px-2 border border-gray-300 rounded-sm bg-gray-100">
                      {details.inventory?.invItemBrand}
                    </p>
                    <p
                      className={`px-2 py-1 rounded-md ${
                        details.bucketSize === "FIFTY"
                          ? "bg-green-200 border border-green-600 text-green-600"
                          : "bg-orange-200 border border-orange-600 text-orange-600"
                      }`}
                    >
                      {details.bucketSize === "FIFTY"
                        ? "Mini Bucket"
                        : "Large Bucket"}
                    </p>
                    <p
                      className={`px-3 py-1 font-medium border border-gray-300 rounded-lg ${
                        details.status === "ACTIVE"
                          ? "bg-green-500 text-white"
                          : details.status === "INACTIVE"
                          ? "bg-red-500 text-white"
                          : ""
                      }`}
                    >
                      {details.status}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <></>
          )}
          <div className="flex flex-col gap-1">
            <p className="text-[15px] text-gray-700">Remaining Qty</p>
            <Input
              disabled={!activateId}
              className={`border ${
                fieldError ? "border-red-500" : "border-gray-400"
              }`}
              type="number"
              placeholder="(+/-) x .."
              onChange={handleInputChange}
            />
            {fieldError && <p className="text-xs text-red-500">{fieldError}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => void processCompletion()}
            disabled={
              isCompleting ||
              !activateId ||
              remainingQty === null ||
              remainingQty < 0 ||
              inventoryItem === null ||
              bucket === null
            }
          >
            {isCompleting ? "Completing..." : "Mark as Complete"}
          </Button>
          <Button variant={"secondary"} onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmCompletionBucketModal;
