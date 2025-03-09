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

interface ConfirmActivateBucketModalProps {
  isOpen: boolean;
  onClose: () => void;
  activateId: {
    bucket_id: number;
    store_id: number;
  } | null;
}

const ConfirmActivateBucketModal: React.FC<ConfirmActivateBucketModalProps> = ({
  isOpen,
  activateId,
  onClose,
}) => {
  // const { handleRefreshBuckets } = usePos();
  // const { isActivating, handleActivate, activateError } =
  //   useBucketServerActions();

  // console.log(activateId);

  // const processActivation = async () => {
  //   if (activateId) {
  //     await handleActivate(activateId?.bucket_id, activateId?.store_id);
  //     handleRefreshBuckets();
  //     onClose;
  //   }
  // };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle>Bucket Activation</DialogTitle>
          {/* {activateError && (
            <p className="text-sm text-red-500 mt-1">{activateError}</p>
          )} */}
          <DialogDescription>
            Please Verify and confirm activation
          </DialogDescription>
        </DialogHeader>
        {activateId ? (
          <p className="text-sm">
            Are you sure you want to activate this bucket ?, It's before of it's
            scheduled time
          </p>
        ) : (
          <></>
        )}
        <DialogFooter>
          <Button
          // onClick={() => void processActivation()}
          // disabled={isActivating || !activateId}
          >
            {/* {isActivating ? "Activating..." : "Activate Bucket"} */}
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
