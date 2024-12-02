"use client";
import { Input } from "@/components/ui/input";
import { IoGrid } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import React, { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { useInventory } from "../contexts/inventory/InventoryContext";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import DeleteProductModal from "@/components/feature/inventory/feature-component/FormModals/DeleteProductsModal";
import RestockProductModal from "@/components/feature/inventory/feature-component/FormModals/RestockProductModal";
import { Inventory } from "@prisma/client";

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

interface JsonRenderProps {
  item: Inventory;
  field: string;
}

const JsonRender: React.FC<JsonRenderProps> = ({ item, field }) => {
  return (
    <p>
      {typeof item.invAdditional === "object" &&
      item.invAdditional !== null &&
      field in item.invAdditional
        ? String((item.invAdditional as Record<string, unknown>)[field])
        : ""}
    </p>
  );
};

// Inventory Display Component
interface InventoryDisplayProps {
  displayState: "list" | "grid";
  inventoryItems: Inventory[];
}

const InventoryDisplay: React.FC<InventoryDisplayProps> = ({
  displayState,
  inventoryItems,
}) => {
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (displayState === "list") {
    return (
      <motion.div initial="hidden" animate="visible" variants={listVariants}>
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
            <AnimatePresence>
              {inventoryItems.map((item, index) => (
                <motion.tr
                  key={item.invId}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={itemVariants}
                  className={`border-b border-gray-200 hover:bg-green-100 cursor-pointer ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <TableCell>{`#${item.invId}`}</TableCell>
                  <TableCell>{`${item.invItem}`}</TableCell>
                  <TableCell>{item.invItemBrand}</TableCell>
                  <TableCell>{item.invItemType}</TableCell>
                  <TableCell>{item.invItemStock}</TableCell>
                  <TableCell>₹{item.invItemPrice}</TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      initial="hidden"
      animate="visible"
      variants={listVariants}
    >
      <AnimatePresence>
        {inventoryItems.map((item) => (
          <motion.div
            key={item.invId}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={itemVariants}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300 bg-[#F5F5F5] flex flex-col gap-3">
              <CardHeader>
                <CardTitle className="text-sm flex justify-between items-center">
                  <p className="font-light rounded-sm px-2 py-1 bg-[#F5F7F9] border border-1 border-gray-300">
                    {item.invItemBrand}
                  </p>
                  <p className="font-light rounded-sm px-2 py-1 bg-[#F5F7F9] border border-1 border-gray-300 flex gap-1 text-gray-500">
                    <JsonRender field="size" item={item} />
                    <JsonRender field="measurement" item={item} />
                  </p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-light text-xs text-gray-500 rounded-sm w-fit px-2 py-1 bg-[#F5F7F9] border border-1 border-gray-300">
                    <JsonRender field="category" item={item} />
                  </p>
                  <p className="text-xl">{item.invItem}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">
                      ₹{item.invItemPrice}
                    </span>
                    <span className="text-sm text-gray-600">
                      Qty: {item.invItemStock}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

// Main Inventory Page Component
const InventoryPage = () => {
  const {
    inventoryItems,
    isLoading: isLoadingProducts,
    handleRefresh,
  } = useInventory();
  const [displayState, setDisplayState] = useState<string>("list");
  const [isAddProdModalOpen, setIsAddProdModalOpen] = useState<boolean>(false);
  const [isDeleteProdModalOpen, setIsDeleteProdModalOpen] =
    useState<boolean>(false);
  const [isRestockProdModalOpen, setIsRestockProdModalOpen] =
    useState<boolean>(false);

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
      <RestockProductModal
        isOpen={isRestockProdModalOpen}
        inventoryItems={inventoryItems ?? []}
        onClose={() => handleCloseModal(setIsRestockProdModalOpen)}
      />
      <DeleteProductModal
        isOpen={isDeleteProdModalOpen}
        inventoryItems={inventoryItems ?? []}
        onClose={() => handleCloseModal(setIsDeleteProdModalOpen)}
      />
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
            openRestockModal={() => handleOpenModal(setIsRestockProdModalOpen)}
            openDeleteModal={() => handleOpenModal(setIsDeleteProdModalOpen)}
          />
          <Button
            onClick={() => handleOpenModal(setIsAddProdModalOpen)}
            variant={"secondary"}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Inventory Render */}
      <div>
        {isLoadingProducts ? (
          <div>Fetching Products</div>
        ) : (
          <div>
            {!inventoryItems ? (
              <div>Issue in Rendering Inventory Items</div>
            ) : inventoryItems.length === 0 ? (
              <div>Let's begin adding products to your inventory</div>
            ) : (
              <InventoryDisplay
                displayState={displayState as "list" | "grid"}
                inventoryItems={inventoryItems}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
