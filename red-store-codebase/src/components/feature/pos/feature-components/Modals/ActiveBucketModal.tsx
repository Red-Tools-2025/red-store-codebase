import { usePos } from "@/app/contexts/pos/PosContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ActiveBucketModalProps {
  isOpen: boolean;
  onClose: () => void;
  activateId: {
    bucket_id: number;
    store_id: number;
  } | null;
}

const ActiveBucketModal: React.FC<ActiveBucketModalProps> = ({
  onClose,
  isOpen,
  activateId,
}) => {
  const { bucketMap } = usePos();

  const details = activateId ? bucketMap.get(activateId.bucket_id) : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle>Bucket Activation</DialogTitle>
          <DialogDescription>
            Details on your active bucket modal, for{" "}
            {details?.inventory?.invItem}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ActiveBucketModal;
