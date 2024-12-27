import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { BsDatabaseAdd } from "react-icons/bs";
interface InventoryEmptyStateProps {
  handleOpenModal: (
    setModalType: React.Dispatch<SetStateAction<boolean>>
  ) => void;
  setIsDefineStoreModalOpen: Dispatch<React.SetStateAction<boolean>>;
}
const InventoryEmptyState: React.FC<InventoryEmptyStateProps> = ({
  handleOpenModal,
  setIsDefineStoreModalOpen,
}) => {
  return (
    <div className="py-10 flex items-center justify-center font-inter">
      <div className="flex flex-col items-center">
        <div className="p-5 bg-gradient-to-b from-gray-200 to-white rounded-full">
          <BsDatabaseAdd className="text-5xl text-gray-700" />
        </div>
        <div className="flex flex-col items-center mt-5">
          <p className="text-xl font-[600] text-[#101828]">
            Products not found
          </p>
          <p className="text-center font-[400] w-[450px] text-[16px] text-gray-600 mt-2">
            Hey, your store seems{" "}
            <span className="underline decoration-gray-600">to be empty</span>,
            Let's begin by adding some products to it, so you can start selling
            !!.
          </p>
          <div className="flex gap-2 mt-3">
            <Button
              onClick={() => handleOpenModal(setIsDefineStoreModalOpen)}
              variant="primary"
            >
              Start Adding
            </Button>
            <Button variant="secondary">Pick a template</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InventoryEmptyState;
