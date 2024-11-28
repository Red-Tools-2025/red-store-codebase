import { useInventory } from "@/app/contexts/inventory/InventoryContext";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Inventory } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";

import React, { useMemo, useState } from "react";

interface RestockProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItems: Inventory[];
}

interface ProductToUpdate {
  invId: number;
  invItem: string;
}

const RestockProductModal: React.FC<RestockProductModalProps> = ({
  inventoryItems,
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const { selectedStore } = useInventory();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [productsToUpdate, setProductsToUpdate] = useState<ProductToUpdate[]>(
    []
  );

  const handleAddProduct = (product: Inventory) => {
    if (!productsToUpdate.some((p) => p.invId === product.invId)) {
      setProductsToUpdate((prev) => [
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
    setProductsToUpdate((prev) =>
      prev.filter((product) => product.invId !== invId)
    );
  };
  // Memoized filtered suggestions
  const suggestionItems = useMemo(() => {
    // Filter out already selected products and match search term
    return inventoryItems
      .filter(
        (item) =>
          !productsToUpdate.some((p) => p.invId === item.invId) &&
          item.invItem.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 suggestions
  }, [inventoryItems, searchTerm, productsToUpdate]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restock your products</DialogTitle>
          <DialogDescription>
            Search and select products to restock
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
            {productsToUpdate.map((product) => (
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
      </DialogContent>
    </Dialog>
  );
};

export default RestockProductModal;
