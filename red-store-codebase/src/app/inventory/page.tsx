"use client";
import React, { SetStateAction, useState } from "react";
import { useInventory } from "../contexts/inventory/InventoryContext";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddProductModal from "@/components/feature/inventory/feature-component/FormModals/AddProductModal";
import { Toaster } from "@/components/ui/toaster";
import DeleteProductModal from "@/components/feature/inventory/feature-component/FormModals/DeleteProductsModal";
import RestockProductModal from "@/components/feature/inventory/feature-component/FormModals/RestockProductModal";
import { Inventory } from "@prisma/client";
import InventoryControlPanel from "@/components/feature/inventory/feature-component/Panels/InventoryControlPanel";
import InventoryEmptyState from "@/components/feature/inventory/feature-component/DisplayStates/InventoryEmptyState";
import DefineStoreModal from "@/components/feature/inventory/feature-component/FormModals/DefineStoreModal";
import { InventoryDataTableColumns } from "@/components/feature/inventory/feature-component/Tables/InventoryDataTable/InventoryDataTableColumns";
import InventoryDataTable from "@/components/feature/inventory/feature-component/Tables/InventoryDataTable";
import InventoryPaginationPanel from "@/components/feature/inventory/feature-component/Panels/InventoryPaginationPanel";
import useInventoryTableHook from "../hooks/inventory/StaticHooks/useInventoryTableHook";
import { Table } from "@tanstack/react-table";
import InventoryFilterPanel from "@/components/feature/inventory/feature-component/Panels/InventoryFilterPanel";

// interface JsonRenderProps {
//   item: Inventory;
//   field: string;
// }

// const JsonRender: React.FC<JsonRenderProps> = ({ item, field }) => {
//   return (
//     <p>
//       {typeof item.invAdditional === "object" &&
//       item.invAdditional !== null &&
//       field in item.invAdditional
//         ? String((item.invAdditional as Record<string, unknown>)[field])
//         : ""}
//     </p>
//   );
// };

// Inventory Display Component
interface InventoryDisplayProps {
  displayState: "list" | "grid";
  inventoryItems: Inventory[];
  table: Table<Inventory>;
}

const InventoryDisplay: React.FC<InventoryDisplayProps> = ({
  displayState,
  inventoryItems,
  table,
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
    return <InventoryDataTable table={table} />;
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
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
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
    intializedScanner,
    license,
    selectedStore,
    setCurrentPage,
    setPageSize,
    currentPage,
    pageSize,
    total_count,
    handleRefresh,
  } = useInventory();
  const { sorting, table } = useInventoryTableHook({
    data: inventoryItems ?? [],
    columns: InventoryDataTableColumns,
  });
  const [displayState, setDisplayState] = useState<string>("list");
  const [isAddProdModalOpen, setIsAddProdModalOpen] = useState<boolean>(false);
  const [isDeleteProdModalOpen, setIsDeleteProdModalOpen] =
    useState<boolean>(false);
  const [isRestockProdModalOpen, setIsRestockProdModalOpen] =
    useState<boolean>(false);
  const [isDefineStoreModalOpen, setIsDefineStoreModalOpen] =
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

  console.log({ intializedScanner, license });

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
        productTypes={["G", "P", "C"]}
        // G - Glass
        // C - Can
        // P - PET Bottles

        onClose={() => handleCloseModal(setIsAddProdModalOpen)}
      />
      <DefineStoreModal
        isOpen={isDefineStoreModalOpen}
        onClose={() => handleCloseModal(setIsDefineStoreModalOpen)}
      />

      {/* Inventory Control Panel */}
      <InventoryControlPanel
        displayState={displayState}
        handleOpenModal={handleOpenModal}
        handleRefresh={handleRefresh}
        setDisplayState={setDisplayState}
        setIsAddProdModalOpen={setIsAddProdModalOpen}
        setIsDeleteProdModalOpen={setIsDeleteProdModalOpen}
        setIsRestockProdModalOpen={setIsRestockProdModalOpen}
      />

      <InventoryFilterPanel data={inventoryItems ?? []} table={table} />

      {/* Inventory Render */}
      <div>
        {isLoadingProducts ? (
          <div>Fetching Products</div>
        ) : (
          <div>
            {!inventoryItems ? (
              <div>Issue in Rendering Inventory Items</div>
            ) : inventoryItems.length === 0 ? (
              <InventoryEmptyState
                selectedStore={selectedStore}
                handleOpenModal={handleOpenModal}
                setIsDefineStoreModalOpen={setIsDefineStoreModalOpen}
                setIsAddProdModalOpen={setIsAddProdModalOpen}
              />
            ) : (
              <InventoryDisplay
                table={table}
                displayState={displayState as "list" | "grid"}
                inventoryItems={inventoryItems}
              />
            )}
          </div>
        )}
      </div>

      {/* Inventory Pagination Controls */}
      <InventoryPaginationPanel
        total_count={total_count}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
      />
    </div>
  );
};

export default InventoryPage;
