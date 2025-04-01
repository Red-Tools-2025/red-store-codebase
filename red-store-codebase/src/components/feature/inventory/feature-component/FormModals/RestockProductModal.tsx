import { useInventory } from "@/app/contexts/inventory/InventoryContext";
import useScanner from "@/app/hooks/scanner/StaticHooks/useScanner";
import BarcodeScanner from "@/components/BarcodeScanner";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Inventory } from "@prisma/client";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Trash2, X } from "lucide-react";

import React, { useMemo, useState } from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { LuScanFace } from "react-icons/lu";

interface RestockProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItems: Inventory[];
}

interface ProductToUpdate {
  invId: number;
  invItem: string;
  productDetails: Inventory;
  restockQuantity: number;
  invItemBarcode: string | null;
}

const RestockProductModal: React.FC<RestockProductModalProps> = ({
  inventoryItems,
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const {
    closeScanner,
    onScannedSearchProduct,
    toggleScanning,
    setInitializedScanner,
    openScanner,
    initializedScanner,
    license,
  } = useScanner();
  const { selectedStore, handleRefresh } = useInventory();

  const [isRestocking, setisRestocking] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [productsToUpdate, setProductsToUpdate] = useState<ProductToUpdate[]>(
    []
  );
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  const handleAddProduct = (product: Inventory) => {
    if (!productsToUpdate.some((p) => p.invId === product.invId)) {
      setProductsToUpdate((prev) => [
        ...prev,
        {
          invId: product.invId,
          invItem: product.invItem,
          restockQuantity: selectedQuantity,
          productDetails: product,
          invItemBarcode: product.invItemBarcode,
        },
      ]);
      setSearchTerm("");
      setSelectedQuantity(1); // Reset quantity after adding
    }
  };

  const handleIncrementRestockValue = (product_id: number) => {
    setProductsToUpdate(
      productsToUpdate.map((p) =>
        p.invId === product_id
          ? { ...p, restockQuantity: p.restockQuantity + 1 }
          : p
      )
    );
  };

  const handleDecrementRestockValue = (product_id: number) => {
    setProductsToUpdate(
      productsToUpdate.map((p) =>
        p.invId === product_id
          ? {
              ...p,
              restockQuantity:
                p.restockQuantity === 1
                  ? p.restockQuantity
                  : p.restockQuantity - 1,
            }
          : p
      )
    );
  };

  const handleAddByBarcode = (searchBarcode: string) => {
    const productToAdd = inventoryItems.find(
      (item) => item.invItemBarcode === searchBarcode
    );
    handleAddProduct(productToAdd as Inventory);
  };

  const handleRemoveProduct = (invId: number) => {
    setProductsToUpdate((prev) =>
      prev.filter((product) => product.invId !== invId)
    );
  };

  const handleBulkUpdate = async (products_update_list: ProductToUpdate[]) => {
    try {
      setisRestocking(true);
      const payload = products_update_list.map((p) => ({
        storeId: selectedStore?.storeId,
        productId: p.invId,
        recievedStock: p.restockQuantity,
      }));

      console.log(payload);
      const update_response = await axios.patch<{
        message: string;
        updatedProducts: Inventory[];
      }>("/api/inventory/products/batch", {
        productBatch: payload,
      });

      toast({
        title: "Success",
        description: `Updated stock for ${update_response.data.updatedProducts.map(
          (p) => {
            return `${p.invItem}, `;
          }
        )}`,
        variant: "default",
      });
      setisRestocking(false);
      setProductsToUpdate([]);
      handleRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      setisRestocking(false);
      toast({
        title: "Error",
        description: "Failed to delete products",
        variant: "destructive",
      });
    }
  };

  // Memoized filtered suggestions
  const suggestionItems = useMemo(() => {
    const filtered = inventoryItems.filter((item) => {
      const matchesProductName = item.invItem
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());
      const matchesBrand = item.invItemBrand
        ?.toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

      return (
        !productsToUpdate.some((p) => p.invId === item.invId) &&
        (matchesProductName || matchesBrand)
      );
    });

    return filtered.slice(0, 5);
  }, [inventoryItems, searchTerm, productsToUpdate]);

  console.log(suggestionItems);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Restock your products</DialogTitle>
          <DialogDescription>
            Search and select products to restock
          </DialogDescription>
        </DialogHeader>
        <BarcodeScanner
          license={license}
          onInitialized={() => setInitializedScanner(true)}
          isActive={openScanner}
          onScanned={(results) =>
            onScannedSearchProduct(results, handleAddByBarcode)
          }
          onClose={closeScanner} // Pass onClose function here
        />

        <div className="flex items-center space-x-2 mb-4">
          <Command className="flex-grow">
            <CommandInput
              value={searchTerm}
              onValueChange={setSearchTerm}
              placeholder="Search via product or brand to restock"
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

          <Input
            type="number"
            min="1"
            value={selectedQuantity}
            onChange={(e) => setSelectedQuantity(Number(e.target.value))}
            placeholder="Qty"
            className="w-20"
          />
        </div>

        {/* Animated Product List */}
        <div className="max-h-[300px] overflow-y-auto">
          <AnimatePresence>
            {productsToUpdate.map((product) => (
              <motion.div
                key={product.invId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between bg-gray-100 px-1 py-2 rounded-lg mb-2"
              >
                <div className="flex flex-row items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveProduct(product.invId)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <p className="text-sm">{product.invItem}</p>
                </div>
                <div className="flex items-center gap-1">
                  <CiCircleMinus
                    onClick={() => handleDecrementRestockValue(product.invId)}
                    className="cursor-pointer hover:text-blue-600 transition-all"
                    size={20}
                  />
                  <span className="bg-blue-100 px-2 border text-sm rounded-md border-blue-600 py-1 text-blue-600 font-semibold">
                    +{product.restockQuantity}
                  </span>
                  <CiCirclePlus
                    onClick={() => handleIncrementRestockValue(product.invId)}
                    className="cursor-pointer hover:text-blue-600 transition-all"
                    size={20}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <DialogFooter>
          {initializedScanner ? (
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
          )}
          <Button
            onClick={() => handleBulkUpdate(productsToUpdate)}
            disabled={productsToUpdate.length === 0 || isRestocking}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isRestocking
              ? `Restocking...`
              : `Restock ${productsToUpdate.length} Product(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RestockProductModal;
