import { Inventory } from "@prisma/client";
import { Table } from "@tanstack/react-table";
import InventorySelectFilterType from "./InventorySelectFilterType";

interface InventoryFilterPanelProps {
  data: Inventory[];
  table: Table<Inventory>;
}
const InventoryFilterPanel: React.FC<InventoryFilterPanelProps> = ({
  data,
  table,
}) => {
  const brandFilterOptions = Array.from(
    new Set(data.map((item) => item.invItemBrand))
  );
  const typeFilterOptions = Array.from(
    new Set(data.map((item) => item.invItemType))
  );
  return (
    <div className="flex mb-4 gap-2">
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
    </div>
  );
};
export default InventoryFilterPanel;
