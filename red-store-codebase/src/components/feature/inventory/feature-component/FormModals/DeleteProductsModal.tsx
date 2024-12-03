import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { X, Trash2, Check } from "lucide-react";
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
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [productsToDelete, setProductsToDelete] = useState<ProductToDelete[]>(
    []
  );
  const { toast } = useToast();
  const { selectedStore } = useInventory();

  // Memoized filtered suggestions
  const suggestionItems = useMemo(() => {
    // Filter out already selected products and match search term
    return inventoryItems
      .filter(
        (item) =>
          !productsToDelete.some((p) => p.invId === item.invId) &&
          item.invItem.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 suggestions
  }, [inventoryItems, searchTerm, productsToDelete]);

  const handleAddProduct = (product: Inventory) => {
    if (!productsToDelete.some((p) => p.invId === product.invId)) {
      setProductsToDelete((prev) => [
        ...prev,
        {
          invId: product.invId,
          invItem: product.invItem,
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
      setIsDeleting(true);
      // Construct the request payload
      const payload = {
        productBatch: productsToDelete.map((product) => ({
          productId: product.invId,
          storeId: selectedStore?.storeId,
        })),
      };

      // Make the delete request
      await axios.delete("/api/inventory/products/batch", {
        data: payload, // Specify `data` for the DELETE request
      });

      toast({
        title: "Success",
        description: `${productsToDelete.length} product(s) deleted successfully`,
        variant: "default",
      });

      setIsDeleting(false);

      // Reset state
      setProductsToDelete([]);
      onClose();
    } catch (error) {
      setIsDeleting(false);
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

        <Command>
          <CommandInput
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder="Search product to delete"
          />
          <CommandList>
            {searchTerm && (
              <CommandGroup heading="Suggestions">
                {suggestionItems.map((product) => (
                  <CommandItem
                    key={product.invId}
                    value={product.invItem}
                    onSelect={() => handleAddProduct(product)}
                  >
                    <div className="flex justify-between w-full items-center">
                      <span>{product.invItem}</span>
                      <Button variant="ghost" size="icon">
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>

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
            disabled={productsToDelete.length === 0 || isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting
              ? `Deleting...`
              : `Delete ${productsToDelete.length} Product(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductModal;
