import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
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
import { MdOutlineRefresh } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { FaStar } from "react-icons/fa";

interface SetFavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  store_id: string;
  searchKeys: InventoryKey[];
  storemanagerid: string;
}

const SetFavoritesDrawer: React.FC<SetFavoritesDrawerProps> = ({
  isOpen,
  onClose,
  store_id,
  searchKeys,
  storemanagerid,
}) => {
  const {
    getFavoritesForStore,
    storeFavoriteKeyToCache,
    refreshFavoritesForStore,
    removeFavoriteKeyFromCache,
    fetchingFavorites,
  } = useBrowserCache();
  const [search, setSearch] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<InventoryKey[]>([]);
  const [initialKeys, setInitialKeys] = useState<InventoryKey[]>([]);
  const [isUpdatingFavorites, setIsUpdatingFavorites] =
    useState<boolean>(false);

  // Load favorites from the cache when the drawer opens
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

  // Handle closing the drawer, and save favorites to cache if changes are made
  const handleClose = async () => {
    const hasChanges =
      JSON.stringify(selectedKeys) !== JSON.stringify(initialKeys);

    if (hasChanges) {
      console.log("Detected changes in favorites. Processing changes...");

      setIsUpdatingFavorites(true);

      // Find removed favorites
      const removedFavorites = initialKeys.filter(
        (initial) =>
          !selectedKeys.some((selected) => selected.invId === initial.invId)
      );

      // Handle individual removals first (for immediate DB cleanup)
      for (const removedFav of removedFavorites) {
        try {
          await removeFavoriteKeyFromCache(
            removedFav,
            store_id,
            storemanagerid
          );
          console.log(`🗑️ Removed ${removedFav.invItem} from favorites`);
        } catch (error) {
          console.error(`Failed to remove ${removedFav.invItem}:`, error);
        }
      }

      // Then handle the full sync (for additions and ensuring consistency)
      await storeFavoriteKeyToCache(selectedKeys, store_id, storemanagerid);

      setIsUpdatingFavorites(false);
    } else {
      console.log("No changes detected, avoiding API call...");
    }

    onClose();
  };

  const handleRemoveProduct = (searchKey: InventoryKey) => {
    setSelectedKeys(
      (prev) => prev.filter((key) => key.invId !== searchKey.invId) // Only update state, DB removal happens on close
    );
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DrawerContent dir="right" className="max-w-[500px] font-inter">
        <DrawerHeader>
          <DrawerTitle className="text-2xl">
            <div className="flex flex-row items-center gap-2">
              <FaStar size={23} />
              Set Favorites
            </div>
          </DrawerTitle>
          <DrawerDescription>
            Select the products you want to set as favorites. Be sure to choose
            your fastest-moving products
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 px-4 py-2 overflow-y-auto max-h-[calc(100vh-160px)]">
          {/* Selected Products Display */}
          {selectedKeys.length > 0 && (
            <div className="text-[15px] flex flex-col">
              <div className="flex flex-row gap-2 items-center">
                <p className="font-medium">{`Current Favorites (${selectedKeys.length}/25)`}</p>
                <MdOutlineRefresh
                  onClick={() =>
                    void refreshFavoritesForStore(
                      store_id,
                      storemanagerid,
                      setSelectedKeys
                    )
                  }
                  className="text-[23px] rounded-md bg-gray-100 border border-gray-400 hover:bg-gray-200 p-1 cursor-pointer"
                />
              </div>
              <div
                className="flex flex-wrap gap-2 pt-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-md border border-gray-200 bg-white"
                style={{ minHeight: "40px" }}
              >
                {selectedKeys.map((key) => (
                  <span
                    key={key.invId}
                    className="px-2 py-1 text-xs border border-yellow-700 text-yellow-700 rounded-md bg-yellow-100 flex gap-2 items-center"
                  >
                    <p>{key.invItem}</p>
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(key)}
                      className="hover:text-red-500 cursor-pointer transition-all p-0 m-0 bg-transparent border-none"
                      aria-label="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Search Input and Suggestions */}
          {isUpdatingFavorites || fetchingFavorites ? (
            <div className="flex flex-row gap-1 items-center">
              <Spinner className="h-5 text-gray-500" />
              <p className="text-gray-500">
                {isUpdatingFavorites
                  ? "Saving your favorites..."
                  : fetchingFavorites
                  ? "Getting your favorites..."
                  : ""}
              </p>
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
                            selectedKeys.some(
                              (item) => item.invId === key.invId
                            )
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
        </div>

        <DrawerFooter className="flex justify-end gap-2 mt-auto">
          <Button variant="secondary" onClick={handleClose}>
            Done
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SetFavoritesDrawer;
