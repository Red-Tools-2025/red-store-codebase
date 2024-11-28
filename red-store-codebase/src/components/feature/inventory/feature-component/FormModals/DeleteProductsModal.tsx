import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Inventory } from "@prisma/client";
import { useInventory } from "@/app/contexts/inventory/InventoryContext";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItems: Inventory[];
}

interface ProductToDelete {
  invId: number;
  invItem: string;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  isOpen,
  onClose,
  inventoryItems,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [productsToDelete, setProductsToDelete] = useState<ProductToDelete[]>(
    []
  );
  const { toast } = useToast();
  const { selectedStore } = useInventory();

  const handleAddProduct = () => {
    const matchingProduct = inventoryItems.find((product) =>
      product.invItem.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (
      matchingProduct &&
      !productsToDelete.some((p) => p.invId === matchingProduct.invId)
    ) {
      setProductsToDelete((prev) => [
        ...prev,
        {
          invId: matchingProduct.invId,
          invItem: matchingProduct.invItem,
        },
      ]);
      setSearchTerm("");
    }
  };

  const handleRemoveProduct = (invId: number) => {
    setProductsToDelete((prev) =>
      prev.filter((product) => product.invId !== invId)
    );
  };

  const handleBulkDelete = async () => {
    if (productsToDelete.length === 0) {
      toast({
        title: "Error",
        description: "No products selected for deletion",
        variant: "destructive",
      });
      return;
    }

    try {
      const deleteRequests = productsToDelete.map((product) =>
        axios.delete("/api/inventory/products", {
          data: {
            productId: product.invId,
            storeId: selectedStore?.storeId,
          },
        })
      );

      await Promise.all(deleteRequests);

      toast({
        title: "Success",
        description: `${productsToDelete.length} product(s) deleted successfully`,
        variant: "default",
      });

      // Reset state
      setProductsToDelete([]);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete products",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Products</DialogTitle>
          <DialogDescription>
            Search and select products to delete from inventory
          </DialogDescription>
        </DialogHeader>

        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Search product to delete"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddProduct();
              }
            }}
            className="flex-grow"
          />
          <Button variant="outline" onClick={handleAddProduct}>
            Add
          </Button>
        </div>

        {/* Animated Product List */}
        <div className="max-h-[300px] overflow-y-auto">
          <AnimatePresence>
            {productsToDelete.map((product) => (
              <motion.div
                key={product.invId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-2"
              >
                <span>{product.invItem}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveProduct(product.invId)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <DialogFooter>
          <Button
            onClick={handleBulkDelete}
            disabled={productsToDelete.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete {productsToDelete.length} Product(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductModal;
