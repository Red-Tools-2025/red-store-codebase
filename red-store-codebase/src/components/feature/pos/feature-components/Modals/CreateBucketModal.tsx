import {
  Dialog,
  DialogContent,
  DialogDescription,
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

interface CreateBucketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBucketModal: React.FC<CreateBucketModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { originalProducts } = usePos();
  const [search, setSearch] = useState<string>("");

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

        {/* Search Input and Suggestions */}
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600">Find your product</p>
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
                {originalProducts?.map((product) => (
                  <CommandItem
                    key={product.invId}
                    value={`${product.invId}-${product.invItem}`}
                    onSelect={() => console.log(product)}
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
      </DialogContent>
    </Dialog>
  );
};

export default CreateBucketModal;
