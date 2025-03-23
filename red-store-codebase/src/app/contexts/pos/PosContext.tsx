import {
  createContext,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { Bucket, Inventory, Store } from "@prisma/client";
import { Cart } from "@/app/types/pos/cart";
import { ScheduleEntry } from "@/app/types/buckets/components";

interface PosContextType {
  inventoryItems: Inventory[] | null;
  favoriteProducts: Inventory[] | null;
  buckets: (Bucket & { inventory: Inventory | null })[];
  bucketMap: Map<number, Bucket & { inventory: Inventory | null }>;
  scheduleMap: Map<string, ScheduleEntry>;
  cartItems: Cart[];
  isLoading: boolean;
  isReturning: boolean;
  isFetchingBuckets: boolean;
  fetchError: string;
  returnsError: string;
  searchTerm: string;
  selectedStore: Store | null;
  bucketMode: boolean;
  handleResync: () => void;
  handleRefreshBuckets: () => void;
  setCartItems: Dispatch<SetStateAction<Cart[]>>;
  setBucketMode: Dispatch<SetStateAction<boolean>>;
  setClientSideItems: Dispatch<SetStateAction<Inventory[] | null>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  handleReturns: (
    returns: {
      item_details: Inventory;
      return_amt: number;
    }[],
    store_id: number
  ) => Promise<void>;
}

const PosContext = createContext<PosContextType | undefined>(undefined);

export const PosProvider = ({
  children,
  inventoryItems,
  cartItems,
  isLoading,
  isReturning,
  isFetchingBuckets,
  fetchError,
  returnsError,
  searchTerm,
  selectedStore,
  bucketMode,
  favoriteProducts,
  buckets,
  bucketMap,
  scheduleMap,
  handleResync,
  handleReturns,
  handleRefreshBuckets,
  setCartItems,
  setBucketMode,
  setClientSideItems,
  setSearchTerm,
}: {
  children: ReactNode;
  inventoryItems: Inventory[] | null;
  favoriteProducts: Inventory[] | null;
  buckets: (Bucket & { inventory: Inventory | null })[];
  bucketMap: Map<number, Bucket & { inventory: Inventory | null }>;
  scheduleMap: Map<string, ScheduleEntry>;
  cartItems: Cart[];
  isLoading: boolean;
  isReturning: boolean;
  isFetchingBuckets: boolean;
  fetchError: string;
  returnsError: string;
  searchTerm: string;
  bucketMode: boolean;
  selectedStore: Store | null;
  handleResync: () => void;
  handleRefreshBuckets: () => void;
  setCartItems: Dispatch<SetStateAction<Cart[]>>;
  setBucketMode: Dispatch<SetStateAction<boolean>>;
  setClientSideItems: Dispatch<SetStateAction<Inventory[] | null>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  handleReturns: (
    returns: {
      item_details: Inventory;
      return_amt: number;
    }[],
    store_id: number
  ) => Promise<void>;
}) => {
  return (
    <PosContext.Provider
      value={{
        inventoryItems,
        cartItems,
        isLoading,
        isReturning,
        isFetchingBuckets,
        fetchError,
        returnsError,
        searchTerm,
        selectedStore,
        favoriteProducts,
        buckets,
        bucketMap,
        bucketMode,
        scheduleMap,
        handleResync,
        handleReturns,
        handleRefreshBuckets,
        setCartItems,
        setClientSideItems,
        setBucketMode,
        setSearchTerm,
      }}
    >
      {children}
    </PosContext.Provider>
  );
};

export const usePos = () => {
  const context = useContext(PosContext);
  if (context === undefined) {
    throw new Error("usePos must be used within a PosProvider");
  }
  return context;
};
