import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
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
import { BucketSize, Inventory } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CreateBucketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* Popover UI for picking bucket time */

const TimePicker = ({
  onTimeSelect,
}: {
  onTimeSelect: (time: string) => void;
}) => {
  const [time, setTime] = useState("");

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, "yyyy-MM-dd");
    const formattedTime = e.target.value + ":00.000+00";
    const newTime = `${formattedDate} ${formattedTime}`;
    setTime(newTime);
    onTimeSelect(newTime);
  };

  return (
    <input
      type="time"
      onChange={handleTimeChange}
      className="w-full border border-gray-500 px-3 py-1 rounded-lg"
    />
  );
};

const CreateBucketModal: React.FC<CreateBucketModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { originalProducts, favoriteProducts, selectedStore } = usePos();
  const [search, setSearch] = useState<string>("");
  const [products, setProducts] = useState<Inventory[] | null>(
    originalProducts
  );
  const [selectedProduct, setSelectedProduct] = useState<Inventory | null>(
    null
  );
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [bucketSize, setBucketSize] = useState<BucketSize>("FIFTY");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle>Create Bucket</DialogTitle>
          <DialogDescription>
            Select a product and a scheduled time for the day to create your
            bucket. You can also activate a bucket at your convenience.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <p className={!selectedProduct ? "text-sm text-gray-600" : "text-sm"}>
            {!selectedProduct ? "Find your product" : "Selected Product"}
          </p>
          {/* Hide Search Upon Product Selection */}

          {!selectedProduct ? (
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <Button
                  onClick={() => setProducts(originalProducts)}
                  className={`${
                    products === originalProducts
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
              {/* Search Input and Suggestions */}
              <Command className="relative w-full border rounded-md">
                <CommandInput
                  placeholder="Enter product name..."
                  value={search}
                  onValueChange={setSearch}
                  className="border-b border-gray-300 px-2 py-1 text-sm"
                />
                <CommandList className="max-h-60 overflow-y-auto bg-white border rounded-md shadow-sm">
                  <CommandEmpty className="p-2 text-sm text-gray-500">
                    {`No matching products found :(`}
                  </CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    {products?.map((product) => (
                      <CommandItem
                        key={product.invId}
                        value={`${product.invId}-${product.invItem}`}
                        onSelect={() => setSelectedProduct(product)}
                        className={`cursor-pointer px-3 py-2 text-sm flex items-center gap-3 rounded-md `}
                      >
                        <p>
                          {product.invItem.length > 30
                            ? product.invItem.slice(0, 30) + "..."
                            : product.invItem}
                        </p>
                        <span className="text-xs py-1 px-2 border border-gray-300 rounded-sm bg-gray-100">
                          {product.invItemBrand}
                        </span>
                        <span className="text-xs py-1 px-2 border text-blue-600 border-blue-600 rounded-sm bg-blue-100">
                          {product.invId}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-start">
              <div className="flex flex-row gap-2 items-center">
                <div className="text-sm flex flex-row items-center gap-2 p-2 rounded-md border border-blue-600 text-blue-600 bg-blue-100">
                  <p>{selectedProduct.invItem}</p>
                  <span className="text-xs py-1 text-black px-2 border border-gray-300 rounded-sm bg-gray-100">
                    {selectedProduct.invId}
                  </span>
                  <span className="text-xs py-1 text-black px-2 border border-gray-300 rounded-sm bg-gray-100">
                    {selectedProduct.invItemBrand}
                  </span>
                </div>
                <div
                  onClick={() => setSelectedProduct(null)}
                  className="hover:text-red-500 transition-all cursor-pointer"
                >
                  x
                </div>
              </div>
              <div className="flex flex-row w-full mt-3 items-center gap-5">
                <div className="flex flex-col gap-2">
                  <p className="text-sm">Time</p>
                  <TimePicker onTimeSelect={setScheduledTime} />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm">Bucket Size</p>
                  <div className="flex flex-row gap-2">
                    <Button
                      onClick={() => setBucketSize("FIFTY")}
                      className={
                        bucketSize === "FIFTY"
                          ? "bg-blue-100 text-blue-600 border-blue-600"
                          : ""
                      }
                      size="sm"
                      variant="secondary"
                    >
                      Mini Bucket (50)
                    </Button>
                    <Button
                      onClick={() => setBucketSize("HUNDRED")}
                      className={
                        bucketSize === "HUNDRED"
                          ? "bg-blue-100 text-blue-600 border-blue-600"
                          : ""
                      }
                      size="sm"
                      variant="secondary"
                    >
                      Lg Bucket (100)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {selectedProduct ? (
          <DialogFooter className="mt-2">
            <Button>Create Bucket</Button>
            <Button variant="secondary">Cancel</Button>
          </DialogFooter>
        ) : (
          <></>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateBucketModal;
