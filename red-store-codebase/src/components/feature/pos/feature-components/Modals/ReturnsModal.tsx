import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useState } from "react";

interface ReturnsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReturnsModal: React.FC<ReturnsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle>Returned Products</DialogTitle>
          {/* {finishError && (
          <p className="text-sm text-red-500 mt-1">{finishError}</p>
        )} */}
          <DialogDescription>
            Details on your active bucket modal, for
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
          // disabled={!details || isFinishing}
          // onClick={() =>
          //   void processFinish(
          //     details?.bucketId as number,
          //     details?.storeId as number
          //   )
          // }
          >
            {/* {isFinishing ? "Updating status...." : "Mark as Finished"} */}
            Confirm Returns
          </Button>
          <Button onClick={onClose} variant="secondary">
            Exit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnsModal;
