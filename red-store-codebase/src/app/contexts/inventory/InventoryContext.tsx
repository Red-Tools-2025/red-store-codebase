import {
  createContext,
  useContext,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";
import { SessionUserType } from "@/app/types/management/context";
import { Inventory, Store } from "@prisma/client";

interface InventoryContextType {
  sessionData: SessionUserType | null;
  inventoryItems: Inventory[] | null;
  isLoading: boolean;
  selectedStore: Store | null;
  intializedScanner: boolean;
  license: string;
  handleRefresh: () => void;
  currentPage: number;
  pageSize: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export const InventoryProvider = ({
  children,
  sessionData,
  inventoryItems,
  selectedStore,
  isLoading,
  intializedScanner,
  license,
  handleRefresh,
  setCurrentPage,
  setPageSize,
  pageSize,
  currentPage,
}: {
  children: ReactNode;
  sessionData: SessionUserType | null;
  inventoryItems: Inventory[] | null;
  selectedStore: Store | null;
  isLoading: boolean;
  intializedScanner: boolean;
  currentPage: number;
  pageSize: number;
  license: string;
  handleRefresh: () => void;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <InventoryContext.Provider
      value={{
        sessionData,
        inventoryItems,
        isLoading,
        selectedStore,
        intializedScanner,
        license,
        handleRefresh,
        setCurrentPage,
        setPageSize,
        pageSize,
        currentPage,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
