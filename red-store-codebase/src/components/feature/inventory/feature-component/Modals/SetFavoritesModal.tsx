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
} from "@/components/ui/command";
import { useState } from "react";

interface SetFavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: string[]; // List of product names
}

const SetFavoritesModal: React.FC<SetFavoritesModalProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  const [search, setSearch] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle>Set Favorites</DialogTitle>
          <DialogDescription>
            Select the products you want to set as favorites. Be sure to choose
            your fastest-moving products.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <p className="text-sm text-gray-600">Find your product</p>
          <Command>
            <CommandInput
              placeholder="Enter product name..."
              value={search}
              onValueChange={setSearch}
              className="border border-gray-400"
            />
            <CommandList>
              <CommandGroup heading="Suggestions">
                {products
                  .filter((product) =>
                    product.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((product) => (
                    <CommandItem key={product} value={product}>
                      {product}
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

export default SetFavoritesModal;
