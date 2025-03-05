import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const VerificationDialog: React.FC<VerificationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold mb-4">
            Confirmation
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>{message}</DialogDescription>
        <DialogFooter className="mt-4 flex justify-between">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Confirm
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
