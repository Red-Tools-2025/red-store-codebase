import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Inventory } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import React from "react";

interface RestockProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItems: Inventory[];
}

const RestockProductModal: React.FC<RestockProductModalProps> = ({
  inventoryItems,
  isOpen,
}) => {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restock your products</DialogTitle>
          <DialogDescription>
            Search and select products to restock
          </DialogDescription>
        </DialogHeader>
        Hi there
      </DialogContent>
    </Dialog>
  );
};
