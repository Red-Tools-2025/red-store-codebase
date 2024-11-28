"use client";
import { InfoCard } from "@/components/feature/management/info-card";
import { Input } from "@/components/ui/input";
import { IoGrid } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import { Badge, IndianRupee } from "lucide-react";
import { SlOptionsVertical } from "react-icons/sl";
import { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { SessionUserType } from "../types/management/context";
import { useInventory } from "../contexts/inventory/InventoryContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash, RefreshCw, Edit } from "lucide-react";
import AddProductModal from "@/components/feature/inventory/feature-component/FormModals/AddProductModal";
import { Toaster } from "@/components/ui/toaster";

// Drop down component move to another folder later

const InventoryActionsCTA = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"secondary"}>
          <SlOptionsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-red-600">
            <Trash className="mr-2 h-4 w-4 text-red-600" /> {/* Delete icon */}
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RefreshCw className="mr-2 h-4 w-4" /> {/* Restock icon */}
            Restock
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" /> {/* Update icon */}
            Update
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const InventoryPage = () => {
  const { inventoryItems, isLoading: isLoadingProducts } = useInventory();
  const [displayState, setDisplayState] = useState<string>("list");
  const [isAddProdModalOpen, setIsAddProdModalOpen] = useState<boolean>(false);

  const handleOpenModal = (
    setModalType: React.Dispatch<SetStateAction<boolean>>
  ) => {
    setModalType(true);
  };

  const handleCloseModal = (
    setModalType: React.Dispatch<SetStateAction<boolean>>
  ) => {
    setModalType(false);
  };

  return (
    <div>
      {/* All modals */}
      <Toaster />
      <AddProductModal
        isOpen={isAddProdModalOpen}
        productTypes={["L", "M", "N", "P", "Q"]}
        amountMeasurements={["ml", "L"]}
        productCategories={[
          "Beer",
          "Wine",
          "Whiskey",
          "Vodka",
          "Rum",
          "Gin",
          "Tequila",
          "Brandy",
          "Liqueur",
          "Cider",
          "Perry",
          "Hard Seltzer",
          "Other",
        ]}
        onClose={() => handleCloseModal(setIsAddProdModalOpen)}
      />
      {/* Control Panel */}
      <div className="my-5 flex items-center justify-between">
        <div className="flex w-2/4 items-center space-x-4">
          <Input
            type="text"
            placeholder="Search Product"
            className="transition-all duration-300 ease-in-out"
          />
          <div className="flex space-x-1">
            {/* Grid Icon */}
            <div
              className={`flex items-center justify-center p-1.5 rounded-sm border cursor-pointer 
              ${
                displayState === "grid"
                  ? "bg-green-200 border-green-500"
                  : "bg-gray-300 border-gray-500 opacity-50"
              } transition-all duration-300 ease-in-out`}
              onClick={() => setDisplayState("grid")}
            >
              <IoGrid
                className={`text-md ${
                  displayState === "grid" ? "text-green-500" : "text-gray-500"
                } transition-all duration-300 ease-in-out`}
              />
            </div>
            {/* List Icon */}
            <div
              className={`flex items-center justify-center p-1.5 rounded-sm border cursor-pointer 
              ${
                displayState === "list"
                  ? "bg-green-200 border-green-500"
                  : "bg-gray-300 border-gray-500 opacity-50"
              }`}
              onClick={() => setDisplayState("list")}
            >
              <FaListUl
                className={`text-md ${
                  displayState === "list" ? "text-green-500" : "text-gray-500"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Other Options */}
        <div className="flex space-x-2">
          {/* <Button variant={"secondary"}>
            <SlOptionsVertical />
          </Button> */}
          <InventoryActionsCTA />
          <Button
            onClick={() => handleOpenModal(setIsAddProdModalOpen)}
            variant={"secondary"}
          >
            Add Product
          </Button>
        </div>
      </div>
      {/* Inventory Render boi*/}
      <div>
        {isLoadingProducts ? (
          <div>Fetching Products</div>
        ) : (
          <div>
            {!inventoryItems ? (
              <div>Issue in Rendering Inventory Items</div>
            ) : inventoryItems.length === 0 ? (
              <div className="Let's begin adding products to your inventory"></div>
            ) : (
              <Table className="w-full border border-gray-200">
                <TableHeader>
                  <TableRow>
                    <TableCell className="border-b border-gray-200 p-3 font-bold text-gray-500">
                      ID
                    </TableCell>
                    <TableCell className="border-b border-gray-200 p-3 font-bold text-gray-500">
                      Product
                    </TableCell>
                    <TableCell className="border-b border-gray-200 p-3 font-bold text-gray-500">
                      Brand
                    </TableCell>
                    <TableCell className="border-b border-gray-200 p-3 font-bold text-gray-500">
                      Type
                    </TableCell>
                    <TableCell className="border-b border-gray-200 p-3 font-bold text-gray-500">
                      Quantity
                    </TableCell>
                    <TableCell className="border-b border-gray-200 p-3 font-bold text-gray-500">
                      Price
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems.map((item, index) => (
                    <TableRow
                      key={index}
                      className={`border-b border-gray-200 hover:bg-green-200 cursor-pointer ${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <TableCell>{`#${item.invitemid}`}</TableCell>
                      <TableCell>{`${item.invItem}`}</TableCell>
                      <TableCell>{item.invItemBrand}</TableCell>
                      <TableCell>{item.invItemType}</TableCell>
                      <TableCell>{item.invItemStock}</TableCell>
                      <TableCell>₹{item.invItemPrice}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
