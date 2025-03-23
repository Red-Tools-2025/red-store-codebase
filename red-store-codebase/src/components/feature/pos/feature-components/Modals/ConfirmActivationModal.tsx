import { usePos } from "@/app/contexts/pos/PosContext";
import useBrowserCache from "@/app/hooks/inventory/ServerHooks/useBrowserCache";
import useBrowserCacheStorage from "@/app/hooks/pos/ServerHooks/useBrowserCacheStorage";
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
import { Dispatch, SetStateAction } from "react";

interface ConfirmActivateBucketModalProps {
  isOpen: boolean;
  activateId: {
    bucket_id: number;
    store_id: number;
  } | null;
  onClose: () => void;
  setIsFinishedBucketId: Dispatch<SetStateAction<number>>;
}

const ConfirmActivateBucketModal: React.FC<ConfirmActivateBucketModalProps> = ({
  isOpen,
  activateId,
  onClose,
  setIsFinishedBucketId,
}) => {
  const { handleRefreshBuckets, bucketMap, inventoryItems, favoriteProducts } =
    usePos();
  const { updateCacheItemCount } = useBrowserCacheStorage();
  const { isActivating, handleActivate, activateError } =
    useBucketServerActions();

  const processActivation = async () => {
    if (activateId && inventoryItems && favoriteProducts) {
      setIsFinishedBucketId(activateId.bucket_id);
      await handleActivate(activateId?.bucket_id, activateId?.store_id);
      handleRefreshBuckets();
      /* Locate Bucket via Id and update client side */
      const bucket = bucketMap.get(activateId.bucket_id);
      const inventory_item =
        inventoryItems.find((item) => item.invId === bucket?.invId) ??
        favoriteProducts.find((item) => item.invId === bucket?.invId);
      const bucketSizeValue =
        bucket?.bucketSize === "FIFTY"
          ? 50
          : bucket?.bucketSize === "HUNDRED"
          ? 100
          : bucket?.bucketSize === "ONE_FIFTY"
          ? 150
          : 0;

      console.log({ inventory_item, bucketSizeValue });
      updateCacheItemCount(inventory_item?.invId as number, bucketSizeValue);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle>Bucket Activation</DialogTitle>
          {activateError && (
            <p className="text-sm text-red-500 mt-1">{activateError}</p>
          )}
          <DialogDescription>
            Please Verify and confirm activation
          </DialogDescription>
        </DialogHeader>
        {activateId ? (
          <p className="text-sm">
            Are you sure you want to activate this bucket ? It&apos;s before of
            it&apos;s scheduled time
          </p>
        ) : (
          <></>
        )}
        <DialogFooter>
          <Button
            onClick={() => void processActivation()}
            disabled={isActivating || !activateId}
          >
            {isActivating ? "Activating..." : "Activate Bucket"}
          </Button>
          <Button variant={"secondary"} onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmActivateBucketModal;
