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

interface SetFavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchKeys: { invItem: string; invId: number }[];
}

const SetFavoritesModal: React.FC<SetFavoritesModalProps> = ({
  isOpen,
  onClose,
  searchKeys,
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
                  .map((key) => (
                    <CommandItem
                      key={key.invId}
                      value={key.invItem}
                      className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 aria-selected:bg-gray-200"
                    >
                      {key.invItem}
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
