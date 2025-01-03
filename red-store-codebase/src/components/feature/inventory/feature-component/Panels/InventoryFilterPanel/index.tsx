import { Inventory } from "@prisma/client";
import { ColumnDefBase, Table } from "@tanstack/react-table";
import InventorySelectFilterType from "./InventorySelectFilterType";
import { IoIosAddCircle } from "react-icons/io";
import { motion } from "framer-motion";
import InventoryExtraFiltersControls from "./InventoryExtraFiltersControls";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface InventoryFilterPanelProps {
  data: Inventory[];
  table: Table<Inventory>;
  showAdditionalFilters: boolean;
  availableNewFilters: {
    header: string;
    accessorKey: string;
    cell: ColumnDefBase<Inventory, string | number | boolean | null>["cell"]; // Optional cell handler for dynamic filtering
  }[];
}

const InventoryFilterPanel: React.FC<InventoryFilterPanelProps> = ({
  data,
  table,
  showAdditionalFilters,
  availableNewFilters,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const brandFilterOptions = Array.from(
    new Set(data.map((item) => item.invItemBrand))
  );
  const typeFilterOptions = Array.from(
    new Set(data.map((item) => item.invItemType))
  );

  // Function to extract unique values for a specific field from invAdditional
  const getUniqueFieldValues = (fieldName: string) => {
    return Array.from(
      new Set(
        data
          .map((item) => {
            const additionalData = item.invAdditional as Record<
              string,
              unknown
            >;
            return additionalData[fieldName]?.toString() || "";
          })
          .filter(Boolean)
      )
    );
  };

  return (
    <div className="flex mb-4 gap-2 items-center">
      <InventorySelectFilterType
        filterValue="invItemBrand"
        table={table}
        filterLabel="Stock Brand"
        filterOptions={brandFilterOptions as string[]}
        filterPlaceholder="Filter by brand"
      />
      <InventorySelectFilterType
        filterValue="invItemType"
        table={table}
        filterLabel="Stock Packaging"
        filterOptions={typeFilterOptions as string[]}
        filterPlaceholder="Filter by packaging"
      />
      {selectedFilters.map((selectedFilter, i) => {
        const filterConfig = availableNewFilters.find(
          (filter) => filter.header === selectedFilter
        );
        if (!filterConfig) return null;

        const filterOptions = getUniqueFieldValues(filterConfig.accessorKey);

        return (
          <InventorySelectFilterType
            key={i}
            filterValue={filterConfig.accessorKey}
            table={table}
            filterLabel={filterConfig.header}
            filterOptions={filterOptions}
            filterPlaceholder={`Filter by ${filterConfig.header}`}
          />
        );
      })}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: showAdditionalFilters ? 1 : 0,
          height: showAdditionalFilters ? "auto" : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {showAdditionalFilters && (
          <InventoryExtraFiltersControls
            availableNewFilters={availableNewFilters}
            setSelectedFilters={setSelectedFilters}
            selectedFilters={selectedFilters}
          >
            <Button variant="ghost" className="px-[5px]">
              <IoIosAddCircle className="text-blue-300 hover:text-blue-500 text-xl cursor-pointer transition-colors" />
            </Button>
          </InventoryExtraFiltersControls>
        )}
      </motion.div>
    </div>
  );
};

export default InventoryFilterPanel;
