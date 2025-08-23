import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { FaListUl } from "react-icons/fa";
import { IoGrid } from "react-icons/io5";
import InventoryActionsCTA from "./InventoryActionsCTA";
import { Dispatch, SetStateAction } from "react";
import InventroySearch from "./InventorySearch";
import { useInventory } from "@/app/contexts/inventory/InventoryContext";
import { IoIosStar } from "react-icons/io";
import { AiFillProduct } from "react-icons/ai";

interface InventoryControlPanelProps {
  displayState: string;
  setDisplayState: Dispatch<SetStateAction<string>>;
  setIsRestockProdModalOpen: Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteProdModalOpen: Dispatch<React.SetStateAction<boolean>>;
  setIsAddProdModalOpen: Dispatch<React.SetStateAction<boolean>>;
  setIsTableViewModalOpen: Dispatch<React.SetStateAction<boolean>>;
  setIsFavortiesModalOpen: Dispatch<React.SetStateAction<boolean>>;
  handleOpenModal: (setModalType: Dispatch<SetStateAction<boolean>>) => void;
  handleRefresh: () => void;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  isFavortiesModalOpen: boolean;
  isAddProdModalOpen: boolean;
  onRefresh: () => void;
  globalFilter: string; // Add globalFilter to props
}

const InventoryControlPanel: React.FC<InventoryControlPanelProps> = ({
  displayState,
  handleOpenModal,
  handleRefresh,
  setDisplayState,
  setIsAddProdModalOpen,
  setIsDeleteProdModalOpen,
  setIsRestockProdModalOpen,
  setIsTableViewModalOpen,
  setIsFavortiesModalOpen,
  setGlobalFilter,
  isFavortiesModalOpen, // This is the prop from parent
  isAddProdModalOpen, // This is the prop from parent
  onRefresh,
  globalFilter,
}) => {
  const { inventoryItems } = useInventory();

  const setSearchFilter = (value: string) => {
    setGlobalFilter(value); // Coming from your hook
  };
  return (
    <div className="my-5 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <InventroySearch
          setSearchFilter={setSearchFilter}
          isFavoritesModalOpen={isFavortiesModalOpen}
          isAddProdModalOpen={isAddProdModalOpen}
          globalFilter={globalFilter} // Pass globalFilter to InventroySearch
        />
        <div className="flex space-x-1">
          {/* Grid Icon */}
          <div
            className={`flex items-center justify-center p-1.5 rounded-sm border cursor-pointer 
          ${
            displayState === "grid"
              ? "bg-red-600 border-red-600"
              : "bg-gray-300 border-gray-500 opacity-50"
          } transition-all duration-300 ease-in-out`}
            onClick={() => setDisplayState("grid")}
          >
            <IoGrid
              className={`text-md ${
                displayState === "grid" ? "text-white" : "text-gray-500"
              } transition-all duration-300 ease-in-out`}
            />
          </div>
          {/* List Icon */}
          <div
            className={`flex items-center justify-center p-1.5 rounded-sm border cursor-pointer 
          ${
            displayState === "list"
              ? "bg-red-600 border-red-600"
              : "bg-gray-300 border-gray-500 opacity-50"
          }`}
            onClick={() => setDisplayState("list")}
          >
            <FaListUl
              className={`text-md ${
                displayState === "list" ? "text-white" : "text-gray-500"
              }`}
            />
          </div>
        </div>
        <Button onClick={() => { handleRefresh(); onRefresh(); }} variant={"secondary"}>
          <div className="flex items-center ">
            <RefreshCw className="mr-2 h-3 w-3" />
            <p>Refresh</p>
          </div>
        </Button>
      </div>

      {/* Other Options */}
      <div className="flex space-x-2">
        <Button
          onClick={() => handleOpenModal(setIsAddProdModalOpen)}
          variant={"new_prime"}
          disabled={
            !inventoryItems || inventoryItems.length === 0 ? true : false
          }
        >
          <div className="flex flex-row items-center gap-1">
            <AiFillProduct />
            <p>Add Product</p>
          </div>
        </Button>
        <Button
          onClick={() => handleOpenModal(setIsFavortiesModalOpen)}
          variant={"secondary"}
        >
          <div className="flex items-center ">
            <IoIosStar className="mr-2 h-3 w-3" />
            <p>Favorites</p>
          </div>
        </Button>
        <InventoryActionsCTA
          inventoryItems={inventoryItems}
          openRestockModal={() => handleOpenModal(setIsRestockProdModalOpen)}
          openDeleteModal={() => handleOpenModal(setIsDeleteProdModalOpen)}
          openTableViewModal={() => handleOpenModal(setIsTableViewModalOpen)}
        />
      </div>
    </div>
  );
};

export default InventoryControlPanel;