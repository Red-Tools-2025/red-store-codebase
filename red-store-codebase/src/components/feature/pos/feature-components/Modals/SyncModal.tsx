import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SyncModalProps {
  isOpen: boolean;
}

const SyncModal: React.FC<SyncModalProps> = ({ isOpen }) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle>Syncing Data</DialogTitle>
          <DialogDescription>
            Please Hold on whole we sync your sales, this will take anywhere at
            most 45 seconds to 1 min
          </DialogDescription>
          <div className="flex flex-col gap-2"></div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SyncModal;
