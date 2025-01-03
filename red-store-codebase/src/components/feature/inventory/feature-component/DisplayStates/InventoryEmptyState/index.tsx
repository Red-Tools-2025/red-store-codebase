import { Button } from "@/components/ui/button";
import {
  DialogContent,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Store } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { BsDatabaseAdd } from "react-icons/bs";
import { PiWarningOctagonFill } from "react-icons/pi";

interface InventoryEmptyStateProps {
  selectedStore: Store | null;
  handleOpenModal: (
    setModalType: React.Dispatch<SetStateAction<boolean>>
  ) => void;
  setIsDefineStoreModalOpen: Dispatch<React.SetStateAction<boolean>>;
  setIsAddProdModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmChangeDefinationDialog: React.FC<{
  isOpen: boolean;
  handleModalClose: () => void;
  handleOpenModal: (
    setModalType: React.Dispatch<SetStateAction<boolean>>
  ) => void;
  setIsDefineStoreModalOpen: Dispatch<React.SetStateAction<boolean>>;
}> = ({
  handleModalClose,
  handleOpenModal,
  isOpen,
  setIsDefineStoreModalOpen,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-[500px] font-inter ">
        <DialogHeader>
          <DialogTitle>Change Store Definitions</DialogTitle>
          <DialogDescription>
            Are you sure you want to proceed with changing the store
            definitions? This is possible because your shop is currently empty.
            However, if you have any sales reports generated previously, this
            change may cause inconsistencies
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={handleModalClose}>
            Go back
          </Button>
          <Button
            onClick={() => {
              handleOpenModal(setIsDefineStoreModalOpen);
              handleModalClose();
            }}
            variant="primary"
          >
            Create New Definations
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const InventoryEmptyState: React.FC<InventoryEmptyStateProps> = ({
  handleOpenModal,
  setIsDefineStoreModalOpen,
  setIsAddProdModalOpen,
  selectedStore,
}) => {
  const [isConfirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  return (
    <div className="py-10 flex items-center justify-center font-inter">
      <ConfirmChangeDefinationDialog
        handleModalClose={() => setConfirmModalOpen(false)}
        handleOpenModal={handleOpenModal}
        isOpen={isConfirmModalOpen}
        setIsDefineStoreModalOpen={setIsDefineStoreModalOpen}
      />
      <div className="flex flex-col items-center">
        <div className="p-5 bg-gradient-to-b from-gray-200 to-white rounded-full">
          {!selectedStore ? (
            <PiWarningOctagonFill className="text-5xl text-gray-700" />
          ) : (
            <BsDatabaseAdd className="text-5xl text-gray-700" />
          )}
        </div>
        <div className="flex flex-col items-center mt-5">
          <p className="text-xl font-[600] text-[#101828]">
            {!selectedStore ? "Issue loading store" : "Products not found"}
          </p>
          <p className="text-center font-[400] w-[450px] text-[16px] text-gray-600 mt-2">
            Hey, your store seems{" "}
            <span className="underline decoration-gray-600">to be empty</span>,
            Let's begin by adding some products to it, so you can start selling
            !!.
          </p>
          <>
            {!selectedStore ? (
              <></>
            ) : (
              <>
                {selectedStore.customfields != null ? (
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => handleOpenModal(setIsAddProdModalOpen)}
                      variant="primary"
                    >
                      Add Product
                    </Button>
                    <Button
                      onClick={() => handleOpenModal(setConfirmModalOpen)}
                      variant="secondary"
                    >
                      Change Definitions
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => handleOpenModal(setIsDefineStoreModalOpen)}
                      variant="primary"
                    >
                      Start Adding
                    </Button>
                    <Button variant="secondary">Pick a template</Button>
                  </div>
                )}
              </>
            )}
          </>
        </div>
      </div>
    </div>
  );
};
export default InventoryEmptyState;
