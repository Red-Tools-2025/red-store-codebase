import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, RefreshCw, Trash } from "lucide-react";
import { SlOptionsVertical } from "react-icons/sl";

// Inventory Actions Dropdown
interface InventoryActionsCTAProps {
  openDeleteModal: () => void;
  openRestockModal: () => void;
}

const InventoryActionsCTA: React.FC<InventoryActionsCTAProps> = ({
  openDeleteModal,
  openRestockModal,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"secondary"}>
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
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InventoryActionsCTA;
