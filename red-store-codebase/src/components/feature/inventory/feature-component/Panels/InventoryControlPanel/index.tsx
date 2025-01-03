import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { FaListUl } from "react-icons/fa";
import { IoGrid } from "react-icons/io5";
import InventoryActionsCTA from "./InventoryActionsCTA";
import { Dispatch, SetStateAction } from "react";
import InventroySearch from "./InventorySearch";
import { useInventory } from "@/app/contexts/inventory/InventoryContext";

interface InventoryControlPanelProps {
  displayState: string;
  setDisplayState: Dispatch<SetStateAction<string>>;
  setIsRestockProdModalOpen: Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteProdModalOpen: Dispatch<React.SetStateAction<boolean>>;
  setIsAddProdModalOpen: Dispatch<React.SetStateAction<boolean>>;
  handleOpenModal: (setModalType: Dispatch<SetStateAction<boolean>>) => void;
  handleRefresh: () => void;
}

const InventoryControlPanel: React.FC<InventoryControlPanelProps> = ({
  displayState,
  handleOpenModal,
  handleRefresh,
  setDisplayState,
  setIsAddProdModalOpen,
  setIsDeleteProdModalOpen,
  setIsRestockProdModalOpen,
}) => {
  const { inventoryItems } = useInventory();
  return (
    <div className="my-5 flex items-center justify-between">
      <div className="flex w-2/4 items-center space-x-4">
        <InventroySearch />
        <div className="flex space-x-1">
          {/* Grid Icon */}
          <div
            className={`flex items-center justify-center p-1.5 rounded-sm border cursor-pointer 
          ${
            displayState === "grid"
              ? "bg-blue-200 border-blue-500"
              : "bg-gray-300 border-gray-500 opacity-50"
          } transition-all duration-300 ease-in-out`}
            onClick={() => setDisplayState("grid")}
          >
            <IoGrid
              className={`text-md ${
                displayState === "grid" ? "text-blue-500" : "text-gray-500"
              } transition-all duration-300 ease-in-out`}
            />
          </div>
          {/* List Icon */}
          <div
            className={`flex items-center justify-center p-1.5 rounded-sm border cursor-pointer 
          ${
            displayState === "list"
              ? "bg-blue-200 border-blue-500"
              : "bg-gray-300 border-gray-500 opacity-50"
          }`}
            onClick={() => setDisplayState("list")}
          >
            <FaListUl
              className={`text-md ${
                displayState === "list" ? "text-blue-500" : "text-gray-500"
              }`}
            />
          </div>
        </div>
        <Button onClick={handleRefresh} variant={"secondary"}>
          <div className="flex items-center ">
            <RefreshCw className="mr-2 h-3 w-3" />
            <p>Refresh</p>
          </div>
        </Button>
      </div>

      {/* Other Options */}
      <div className="flex space-x-2">
        <InventoryActionsCTA
          inventoryItems={inventoryItems}
          openRestockModal={() => handleOpenModal(setIsRestockProdModalOpen)}
          openDeleteModal={() => handleOpenModal(setIsDeleteProdModalOpen)}
        />
        <Button
          onClick={() => handleOpenModal(setIsAddProdModalOpen)}
          variant={"secondary"}
          disabled={
            !inventoryItems || inventoryItems.length === 0 ? true : false
          }
        >
          Add Product
        </Button>
      </div>
    </div>
  );
};

export default InventoryControlPanel;
