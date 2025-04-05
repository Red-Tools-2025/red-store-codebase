import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { usePos } from "@/app/contexts/pos/PosContext";
import { useState } from "react";
import { Inventory } from "@prisma/client";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { IoIosCloseCircle } from "react-icons/io";
import useBrowserCacheStorage from "@/app/hooks/pos/ServerHooks/useBrowserCacheStorage";

interface ReturnsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReturnsModal: React.FC<ReturnsModalProps> = ({ isOpen, onClose }) => {
  const { inventoryItems, favoriteProducts, selectedStore, returnsError } =
    usePos();
  const { saveToCache } = useBrowserCacheStorage();
  const [search, setSearch] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [products, setProducts] = useState<Inventory[] | null>(inventoryItems);
  const [selectedProducts, setSelectedProducts] = useState<
    { item_details: Inventory; return_amt: number }[]
  >([]);

  // for safety and consistency purposes, clear out all saved states on close
  const handleClose = () => {
    setSelectedProducts([]);
    onClose();
  };

  const handleProductSelection = (item: Inventory) => {
    if (
      !selectedProducts.some(
        (selected) => selected.item_details.invId === item.invId
      )
    ) {
      setSelectedProducts((prev) => [
        ...prev,
        { item_details: item, return_amt: 1 },
      ]);
    }
  };

  const handleChangeReturnAmt = (sign: string, product_id: number) => {
    if (sign === "positive") {
      setSelectedProducts((prev) =>
        prev.map((product) =>
          product.item_details.invId === product_id
            ? { ...product, return_amt: product.return_amt + 1 }
            : product
        )
      );
    } else if (sign === "negative") {
      setSelectedProducts((prev) =>
        prev.map((product) =>
          product.item_details.invId === product_id && product.return_amt > 1
            ? { ...product, return_amt: product.return_amt - 1 }
            : product
        )
      );
    }
  };

  const handleRemoveProduct = (product_id: number) => {
    setSelectedProducts((prev) =>
      prev.filter((item) => item.item_details.invId !== product_id)
    );
    setSelectedProducts([]);
    onClose();
  };

  const processReturns = async () => {
    console.log(selectedProducts);
    saveToCache(
      selectedProducts.map((p) => ({
        cartItem: {
          product_id: p.item_details.invId,
          product_current_stock: p.item_details.invItemStock,
          product_name: p.item_details.invItem,
          product_price: p.item_details.invItemPrice,
          productQuantity: -Math.abs(p.return_amt),
        },
        store_id: selectedStore ? selectedStore.storeId.toString() : "",
        purchase_time: new Date().toISOString(),
      })),
      setIsSaving
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px] font-inter">
        <DialogHeader>
          <DialogTitle>Return Products</DialogTitle>
          {returnsError && (
            <p className="text-sm text-red-500 mt-1">{returnsError}</p>
          )}
          <DialogDescription>
            Select products, from the list to mark as returns
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <Button
              onClick={() => setProducts(inventoryItems)}
              className={`${
                products === inventoryItems
                  ? "bg-blue-100 text-blue-600 border-blue-600"
                  : ""
              }`}
              size="sm"
              variant={"secondary"}
            >
              Originals
            </Button>
            <Button
              onClick={() => setProducts(favoriteProducts)}
              className={`${
                products === favoriteProducts
                  ? "bg-yellow-100 text-yellow-600 border-yellow-600"
                  : ""
              }`}
              size="sm"
              variant={"secondary"}
            >
              Favorites
            </Button>
          </div>
          <Command className="relative w-full border rounded-md">
            <CommandInput
              placeholder="Enter product name..."
              value={search}
              onValueChange={setSearch}
              className="border-b border-gray-300 px-2 py-1 text-sm"
            />
            <CommandList className="max-h-[120px] overflow-y-auto bg-white border rounded-md shadow-sm">
              <CommandEmpty className="p-2 text-sm text-gray-500">
                {`No matching products found :(`}
              </CommandEmpty>
              <CommandGroup heading="Suggestions">
                {products
                  ?.filter(
                    (product) =>
                      product.invItem
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      (product.invItemBrand?.toLowerCase() || "").includes(
                        search.toLowerCase()
                      )
                  )
                  .map((product) => {
                    const isOutOfStock = product.invItemStock === 0;
                    return (
                      <CommandItem
                        key={product.invId}
                        value={`${product.invItemBrand}-${product.invItem}`}
                        onSelect={() => {
                          if (!isOutOfStock) handleProductSelection(product);
                        }}
                        className={`cursor-pointer px-3 py-2 text-sm flex items-center gap-3 rounded-md transition-all ${
                          isOutOfStock
                            ? "bg-red-100 text-red-600 opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <p>
                          {product.invItem.length > 30
                            ? product.invItem.slice(0, 30) + "..."
                            : product.invItem}
                        </p>
                        <span className="text-xs py-1 px-2 border border-gray-300 rounded-sm bg-gray-100">
                          {product.invItemBrand}
                        </span>
                        <span
                          className={`text-xs py-1 px-2 border rounded-sm ${
                            isOutOfStock
                              ? "text-red-600 border-red-600 bg-red-100"
                              : "text-blue-600 border-blue-600 bg-blue-100"
                          }`}
                        >
                          {isOutOfStock ? "Out of Stock" : product.invItemStock}
                        </span>
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
        {selectedProducts.length > 0 ? (
          <div className="flex flex-col gap-1">
            <p className="font-medium">To be returned</p>
            <div className="border border-1 border-gray-400 p-3 rounded-md flex flex-col gap-2">
              {selectedProducts.map((product, index) => {
                return (
                  <div
                    className="flex flex-row justify-between items-center"
                    key={index}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <IoIosCloseCircle
                        onClick={() =>
                          handleRemoveProduct(product.item_details.invId)
                        }
                        className="h-5 w-5 text-red-400 cursor-pointer hover:text-red-500 transition-all"
                      />
                      <p className="text-[15px]">
                        {product.item_details.invItem}
                      </p>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                      <CiCircleMinus
                        onClick={() =>
                          handleChangeReturnAmt(
                            "negative",
                            product.item_details.invId
                          )
                        }
                        className="h-6 w-6 hover:text-blue-600 transition-all cursor-pointer"
                      />
                      <p>{`${product.return_amt}`}</p>

                      <CiCirclePlus
                        onClick={() =>
                          handleChangeReturnAmt(
                            "positive",
                            product.item_details.invId
                          )
                        }
                        className="h-6 w-6 hover:text-blue-600 transition-all cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <></>
        )}
        <DialogFooter>
          <Button
            disabled={selectedProducts.length === 0 || isSaving}
            onClick={() => void processReturns()}
          >
            {isSaving ? "Returning items...." : "Confirm Returns"}
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
