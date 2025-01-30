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
import { useState } from "react";
import { InventoryKey } from "@/app/types/inventory/components";
import { X } from "lucide-react";

interface SetFavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchKeys: InventoryKey[];
}

const SetFavoritesModal: React.FC<SetFavoritesModalProps> = ({
  isOpen,
  onClose,
  searchKeys,
}) => {
  const [search, setSearch] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<InventoryKey[]>([]);

  // Handles selection & toggling of items
  const handleItem = (searchKey: InventoryKey) => {
    if (searchKeys.length <= 25) {
      setSelectedKeys((prev) => {
        const exists = prev.some((item) => item.invId === searchKey.invId);

        // If the item exists, remove it, otherwise add it if not already in the array
        const newSelectedKeys = exists
          ? prev.filter((item) => item.invId !== searchKey.invId)
          : [...prev, { ...searchKey }];

        // Ensure the selectedKeys array does not exceed 25 items
        return newSelectedKeys.slice(0, 25);
      });
    }
    setSearch(""); // Optional: Clears search input after selection
  };

  const handleRemoveProduct = (searchKey: InventoryKey) => {
    setSelectedKeys((prev) =>
      prev.filter((key) => key.invItem !== searchKey.invItem)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle>Set Favorites</DialogTitle>
          <DialogDescription>
            Select the products you want to set as favorites. Be sure to choose
            your fastest-moving products.
          </DialogDescription>
        </DialogHeader>

        {/* Selected Products Display */}
        {selectedKeys.length > 0 && (
          <div className="text-[15px] flex flex-col">
            <p className="font-medium">{`Selected Products (${selectedKeys.length}/25)`}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedKeys.map((key) => (
                <span
                  key={key.invId}
                  className="px-2 py-1 text-xs border border-blue-500 text-blue-500 rounded-md bg-blue-100 flex gap-2"
                >
                  <p>{key.invItem}</p>
                  <p
                    onClick={() => handleRemoveProduct(key)}
                    className="hover:text-red-500 cursor-pointer transition-all"
                  >
                    <X className="h-4 w-4" />
                  </p>
                </span>
              ))}
            </div>
          </div>
        )}

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
                {searchKeys
                  .filter((key) =>
                    key.invItem.toLowerCase().includes(search.toLowerCase())
                  )
                  .filter(
                    (key) =>
                      !selectedKeys.some((item) => item.invId === key.invId) // Filter out selected items
                  )
                  .map((key) => (
                    <CommandItem
                      key={key.invId}
                      value={key.invItem}
                      onSelect={() => handleItem(key)} // Fixed selection issue
                      className={`cursor-pointer px-3 py-2 text-sm flex items-center gap-3 rounded-md ${
                        selectedKeys.some((item) => item.invId === key.invId)
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <p>{key.invItem}</p>
                      <span className="text-xs py-1 px-2 border border-gray-300 rounded-sm bg-gray-100">
                        {key.invItemBrand}
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

export default SetFavoritesModal;
