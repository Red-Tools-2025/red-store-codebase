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
import { useEffect, useState } from "react";
import { InventoryKey } from "@/app/types/inventory/components";
import { X } from "lucide-react";
import useBrowserCache from "@/app/hooks/inventory/ServerHooks/useBrowserCache";
import { Spinner } from "@/components/ui/spinner";

interface SetFavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  store_id: string;
  searchKeys: InventoryKey[];
  storemanagerid: string;
}

const SetFavoritesModal: React.FC<SetFavoritesModalProps> = ({
  isOpen,
  onClose,
  store_id,
  searchKeys,
  storemanagerid,
}) => {
  const {
    getFavoritesForStore,
    storeFavoriteKeyToCache,
    removeFavoriteKeyFromCache,
  } = useBrowserCache();
  const [search, setSearch] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<InventoryKey[]>([]);
  const [initialKeys, setInitialKeys] = useState<InventoryKey[]>([]);
  const [isUpdatingFavorites, setIsUpdatingFavorites] =
    useState<boolean>(false);
  // Load favorites from the cache when the modal opens
  useEffect(() => {
    const loadFavorites = async () => {
      const { favorite_keys } = await getFavoritesForStore(
        store_id,
        storemanagerid
      );

      setInitialKeys(favorite_keys);
      setSelectedKeys(favorite_keys); // Extract only favorite_keys array
      console.log("Store Manager ID:", storemanagerid);
    };

    if (isOpen) {
      loadFavorites();
    }
  }, [isOpen, store_id]);

  // Handles selection & toggling of items
  const handleItem = (searchKey: InventoryKey) => {
    setSelectedKeys((prev) => {
      const exists = prev.some((item) => item.invId === searchKey.invId);
      const newSelectedKeys = exists
        ? prev.filter((item) => item.invId !== searchKey.invId)
        : [...prev, searchKey];

      return newSelectedKeys.slice(0, 25); // Just update state, don't call API
    });
  };
  // Handle closing the modal, and save favorites to cache if changes are made
  const handleClose = async () => {
    const hasChanges =
      JSON.stringify(selectedKeys) !== JSON.stringify(initialKeys);

    if (hasChanges) {
      console.log("Detected changes in favorites. Posting only new items...");

      // ✅ Handle both additions & deletions properly
      setIsUpdatingFavorites(true);
      await storeFavoriteKeyToCache(selectedKeys, store_id, storemanagerid);
      setIsUpdatingFavorites(false);
    } else {
      console.log("No changes detected, avoiding API call...");
    }

    onClose();
  };

  const handleRemoveProduct = (searchKey: InventoryKey) => {
    setIsUpdatingFavorites(true);
    setSelectedKeys(
      (prev) => prev.filter((key) => key.invId !== searchKey.invId) // ✅ Only update state
    );
    setIsUpdatingFavorites(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
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
            <p className="font-medium">{`Current Favorites (${selectedKeys.length}/25)`}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedKeys.map((key) => (
                <span
                  key={key.invId}
                  className="px-2 py-1 text-xs border border-yellow-700 text-yellow-700 rounded-md bg-yellow-100 flex gap-2"
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
        {isUpdatingFavorites ? (
          <div className="flex flex-row gap-1 items-center">
            <Spinner className="h-5 text-gray-500" />
            <p className="text-gray-500">Saving your favorites...</p>
          </div>
        ) : (
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SetFavoritesModal;
