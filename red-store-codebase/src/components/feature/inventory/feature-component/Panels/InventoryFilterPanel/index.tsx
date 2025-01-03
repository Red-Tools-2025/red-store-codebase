import { Inventory } from "@prisma/client";
import { Table } from "@tanstack/react-table";
import InventorySelectFilterType from "./InventorySelectFilterType";
import { IoIosAddCircle } from "react-icons/io";
import { motion } from "framer-motion";

interface InventoryFilterPanelProps {
  data: Inventory[];
  table: Table<Inventory>;
  showAdditionalFilters: boolean;
  availableNewFilters: { header: string; accessorKey: string }[];
}
const InventoryFilterPanel: React.FC<InventoryFilterPanelProps> = ({
  data,
  table,
  showAdditionalFilters,
  availableNewFilters,
}) => {
  const brandFilterOptions = Array.from(
    new Set(data.map((item) => item.invItemBrand))
  );
  const typeFilterOptions = Array.from(
    new Set(data.map((item) => item.invItemType))
  );

  console.log({ availableNewFilters });
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
          <IoIosAddCircle className="text-blue-300 hover:text-blue-500 text-xl cursor-pointer transition-colors" />
        )}
      </motion.div>
    </div>
  );
};
export default InventoryFilterPanel;
