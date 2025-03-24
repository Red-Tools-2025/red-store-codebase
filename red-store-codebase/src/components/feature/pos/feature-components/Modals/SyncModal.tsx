import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface SyncModalProps {
  isOpen: boolean;
  syncProgress: number;
}

const SyncModal: React.FC<SyncModalProps> = ({ isOpen, syncProgress }) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle>Syncing Data</DialogTitle>
          <DialogDescription>
            Please Hold on whole we sync your sales, this will take anywhere at
            most 45 seconds to 1 min
          </DialogDescription>
          <div className="flex flex-col gap-3 py-3">
            <p className="text-sm">Syncing in progress...</p>
            <Progress value={syncProgress} />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SyncModal;
