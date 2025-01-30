import {
  createContext,
  useContext,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";
import { SessionUserType } from "@/app/types/management/context";
import { Inventory, Store } from "@prisma/client";
import { InventoryKey } from "@/app/types/inventory/components";

interface InventoryContextType {
  infoPanelOpenState: boolean;
  sessionData: SessionUserType | null;
  inventoryItems: Inventory[] | null;
  searchKeys: InventoryKey[];
  inventoryItemDetails?: Inventory;
  isLoading: boolean;
  selectedStore: Store | null;
  intializedScanner: boolean;
  license: string;
  currentPage: number;
  pageSize: number;
  total_count: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  handleRefresh: () => void;
  toggleInfoPanel: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export const InventoryProvider = ({
  children,
  sessionData,
  inventoryItems,
  inventoryItemDetails,
  selectedStore,
  isLoading,
  searchKeys,
  intializedScanner,
  infoPanelOpenState,
  license,
  total_count,
  handleRefresh,
  setCurrentPage,
  toggleInfoPanel,
  setPageSize,
  pageSize,
  currentPage,
}: {
  children: ReactNode;
  infoPanelOpenState: boolean;
  sessionData: SessionUserType | null;
  inventoryItems: Inventory[] | null;
  searchKeys: InventoryKey[];
  inventoryItemDetails?: Inventory;
  selectedStore: Store | null;
  isLoading: boolean;
  intializedScanner: boolean;
  currentPage: number;
  pageSize: number;
  total_count: number;
  license: string;
  handleRefresh: () => void;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  toggleInfoPanel: () => void;
}) => {
  return (
    <InventoryContext.Provider
      value={{
        sessionData,
        inventoryItems,
        inventoryItemDetails,
        searchKeys,
        isLoading,
        selectedStore,
        intializedScanner,
        license,
        total_count,
        handleRefresh,
        setCurrentPage,
        toggleInfoPanel,
        setPageSize,
        pageSize,
        currentPage,
        infoPanelOpenState,
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
