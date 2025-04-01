import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Inventory } from "@prisma/client";
import { RefreshCw, Trash } from "lucide-react";
import { SlOptionsVertical } from "react-icons/sl";
import { GoDatabase } from "react-icons/go";

// Inventory Actions Dropdown
interface InventoryActionsCTAProps {
  openDeleteModal: () => void;
  openRestockModal: () => void;
  openTableViewModal: () => void;
  inventoryItems: Inventory[] | null;
}

const InventoryActionsCTA: React.FC<InventoryActionsCTAProps> = ({
  openDeleteModal,
  openRestockModal,
  openTableViewModal,
  inventoryItems,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"secondary"}
          disabled={
            !inventoryItems || inventoryItems.length === 0 ? true : false
          }
        >
          <SlOptionsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={openDeleteModal} className="text-red-600">
            <Trash className="mr-2 h-4 w-4 text-red-600" />
            Delete
          </DropdownMenuItem>

          <DropdownMenuItem onClick={openRestockModal}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Restock
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openTableViewModal}>
            <GoDatabase className="mr-2 h-4 w-4" />
            Table View
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InventoryActionsCTA;
