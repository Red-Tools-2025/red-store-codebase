import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateBucketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBucketModal: React.FC<CreateBucketModalProps> = ({
  isOpen,
  onClose,
}) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle>Create Bucket</DialogTitle>
          <DialogDescription>
            Select a product, and a scheduled time for the day to create your
            bucket, you can also activate a bucket at your convinience
          </DialogDescription>
        </DialogHeader>

        {/* Selected Products Display */}

        {/* Search Input and Suggestions */}
        {/* <div className="flex flex-col gap-2">
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
      </Command> */}
      </DialogContent>
    </Dialog>
  );
};

export default CreateBucketModal;
