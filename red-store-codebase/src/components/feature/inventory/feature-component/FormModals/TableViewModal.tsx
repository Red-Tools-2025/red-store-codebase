import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Inventory, Store } from "@prisma/client";
import { SetStateAction, useState } from "react";
import { motion } from "framer-motion"; // For smooth animations
import { IoSave } from "react-icons/io5";
import { ColumnDef } from "@tanstack/react-table";

interface TableViewModalProps {
  isOpen: boolean;
  selectedStore: Store | null;
  onClose: () => void;
  onSaveChanges: (columns: ColumnDef<Inventory>[]) => void;
  setShowAdditionalFilters: React.Dispatch<SetStateAction<boolean>>;
}

interface StoreDefination {
  fieldName: string;
  label: string;
  type: string;
  // below fields are only for select type
  allowedValues?: string[];
  handleFilterChange: (column: string, value: string) => void;
}

type InvAdditional = Record<string, string | number>;

const TableViewModal: React.FC<TableViewModalProps> = ({
  isOpen,
  selectedStore,
  onSaveChanges,
  onClose,
  setShowAdditionalFilters,
}) => {
  const [selectedFields, setSelectedFields] = useState<StoreDefination[]>([]);
  const customFields =
    (selectedStore?.customfields as unknown as StoreDefination[]) || [];

  const handleFieldClick = (field: StoreDefination) => {
    const alreadySelected = selectedFields.find(
      (selectedField) => selectedField.fieldName === field.fieldName
    );
    if (alreadySelected) {
      setSelectedFields((prev) =>
        prev.filter(
          (selectedField) => selectedField.fieldName !== field.fieldName
        )
      );
    } else {
      setSelectedFields((prev) => [...prev, field]);
    }
  };

  const handleSaveTableViews = () => {
    const newColumns: ColumnDef<Inventory>[] = selectedFields.map((field) => ({
      // Use accessorFn to extract the value from invAdditional
      accessorFn: (row) => {
        // un processed row data access
        const additionalData = row.invAdditional as InvAdditional;
        return additionalData?.[field.fieldName] ?? null;
      },
      // Use an id so that filtering keys work properly
      id: field.fieldName,
      header: field.label,
      filterFn: "includesString",
      cell: ({ row }) => {
        // processed row data acess
        const additionalData = row.original.invAdditional as InvAdditional;
        return additionalData?.[field.fieldName] ?? "N/A";
      },
    }));

    onSaveChanges(newColumns);
    onClose();
    setShowAdditionalFilters(true);
  };

  const handleCloseModal = () => {
    setSelectedFields([]);
    onSaveChanges([]);
    setShowAdditionalFilters(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[700px] font-inter">
        <DialogHeader>
          <DialogTitle>Edit Table View</DialogTitle>
          <DialogDescription>
            Select the additional data items you want to display. The preview
            below will show how your table will look, and once done we will save
            your changes for the next time you visit.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          {customFields.map((field, index) => (
            <p
              key={index}
              className={`text-xs border px-2 py-1 rounded-md ${
                selectedFields.find(
                  (selectedField) => selectedField.fieldName === field.fieldName
                )
                  ? "bg-red-200 text-red-600 border-red-600"
                  : "bg-gray-200 text-gray-600"
              } hover:bg-red-200 hover:text-red-600 hover:border-red-600 cursor-pointer transition-all`}
              onClick={() => handleFieldClick(field)}
            >
              {field.label}
            </p>
          ))}
        </div>

        <motion.div
          layout
          className="overflow-x-auto border border-gray-300 border-b-0 rounded-md bg-white"
        >
          <table className="table-auto w-full text-[11px] text-left">
            <thead className="bg-gray-100 text-gray-700 ">
              <tr>
                <th className="px-2 py-1 border border-r-1">D</th>
                <th className="px-2 py-1 border border-r-1">Product</th>
                <th className="px-2 py-1 border border-r-1">Brand</th>
                <th className="px-2 py-1 border border-r-1">Type</th>
                <th className="px-2 py-1 border border-r-1">Qty</th>
                <th className="px-2 py-1 border border-r-1">Price</th>
                {selectedFields.map((field) => (
                  <motion.th
                    key={field.fieldName}
                    className="px-2 py-1 bg-red-600 text-white bg-red-600 text-white"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    {field.label}
                  </motion.th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1 border border-b-0 border-r-1">...</td>
                <td className="px-2 py-1 border border-b-0 border-r-1">...</td>
                <td className="px-2 py-1 border border-b-0 border-r-1">...</td>
                <td className="px-2 py-1 border border-b-0 border-r-1">...</td>
                <td className="px-2 py-1 border border-b-0 border-r-1">...</td>
                <td className="px-2 py-1 border border-b-0 border-r-1">...</td>
                {selectedFields.map((field) => (
                  <motion.td
                    key={field.fieldName}
                    className="px-2 py-1 border border-b-0 border-r-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    ...
                  </motion.td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>

        <DialogFooter>
          <Button onClick={handleSaveTableViews} type="submit">
            <div className="flex items-center gap-2">
              <IoSave /> <p>Save changes</p>
            </div>
          </Button>
          <Button onClick={handleCloseModal} variant="secondary" type="submit">
            {setSelectedFields.length > 0 ? "Clear" : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableViewModal;
