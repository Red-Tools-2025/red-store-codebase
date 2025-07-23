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
import useScanner from "@/app/hooks/scanner/StaticHooks/useScanner";
import { LuScanFace } from "react-icons/lu";
import BarcodeScanner from "@/components/BarcodeScanner";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItems: Inventory[];
}

interface ProductToDelete {
  invId: number;
  invItem: string;
  invItemBarcode: string | null;
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
  // const {
  //   closeScanner,
  //   onScannedSearchProduct,
  //   toggleScanning,
  //   setInitializedScanner,
  //   openScanner,
  //   initializedScanner,
  //   license,
  // } = useScanner();
  const { selectedStore, handleRefresh } = useInventory();

  // Memoized filtered suggestions
  const suggestionItems = useMemo(() => {
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    return inventoryItems
      .filter(
        (item) =>
          !productsToDelete.some((p) => p.invId === item.invId) &&
          ((item.invItem ?? "").toLowerCase().includes(normalizedSearchTerm) ||
            (item.invItemBrand ?? "")
              .toLowerCase()
              .includes(normalizedSearchTerm))
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
          invItemBarcode: product.invItemBarcode,
        },
      ]);
      setSearchTerm("");
    }
  };

  const handleAddByBarcode = (searchBarcode: string) => {
    const productToAdd = inventoryItems.find(
      (item) => item.invItemBarcode === searchBarcode
    );
    handleAddProduct(productToAdd as Inventory);
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
      handleRefresh();
    } catch (error) {
      setIsDeleting(false);
      console.error(error);
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
        {/* <BarcodeScanner
          license={license}
          onInitialized={() => setInitializedScanner(true)}
          isActive={openScanner}
          onScanned={(results) =>
            onScannedSearchProduct(results, handleAddByBarcode)
          }
          onClose={closeScanner} // Pass onClose function here
        /> */}

        <Command>
          <CommandInput
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder="Search product to delete"
          />
          <CommandList>
            {searchTerm && (
              <CommandGroup>
                {suggestionItems.length > 0 ? (
                  suggestionItems.map((product) => (
                    <CommandItem
                      key={product.invId}
                      value={`${product.invItemBrand || ""} - ${
                        product.invItem
                      }`}
                      onSelect={() => handleAddProduct(product)}
                    >
                      <div className="flex justify-between w-full items-center">
                        <div className="flex gap-3 items-center">
                          <span>{product.invItem}</span>
                          <div className="flex gap-2 text-xs">
                            <span className="px-2 py-1 bg-white rounded-sm border border-gray-300">
                              {product.invItemBrand}
                            </span>
                            <span className="px-2 py-1 bg-white rounded-sm border border-gray-300">
                              {product.invItemType}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </CommandItem>
                  ))
                ) : (
                  <div className="py-2 px-4 text-sm">
                    No matching products found
                  </div>
                )}
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
          {/* {initializedScanner ? (
            <>
              <Button type="button" onClick={toggleScanning}>
                <div className="flex items-center gap-2">
                  <LuScanFace size={16} />
                  <p>Scan</p>
                </div>
              </Button>
            </>
          ) : (
            <div>Initializing...</div>
          )} */}
          <Button
            variant="secondary"
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
