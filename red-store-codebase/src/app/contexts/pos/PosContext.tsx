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
  originalProducts: Inventory[] | null;
  buckets: (Bucket & { inventory: Inventory | null })[];
  bucketMap: Map<number, Bucket & { inventory: Inventory | null }>;
  scheduleMap: Map<string, ScheduleEntry>;
  cartItems: Cart[];
  isLoading: boolean;
  isFetchingBuckets: boolean;
  fetchError: string;
  selectedStore: Store | null;
  bucketMode: boolean;
  handleResync: () => void;
  handleRefreshBuckets: () => void;
  setCartItems: Dispatch<SetStateAction<Cart[]>>;
  setBucketMode: Dispatch<SetStateAction<boolean>>;
  setClientSideItems: Dispatch<SetStateAction<Inventory[] | null>>;
}

const PosContext = createContext<PosContextType | undefined>(undefined);

export const PosProvider = ({
  children,
  inventoryItems,
  cartItems,
  isLoading,
  isFetchingBuckets,
  fetchError,
  selectedStore,
  bucketMode,
  favoriteProducts,
  originalProducts,
  buckets,
  bucketMap,
  scheduleMap,
  handleResync,
  handleRefreshBuckets,
  setCartItems,
  setBucketMode,
  setClientSideItems,
}: {
  children: ReactNode;
  inventoryItems: Inventory[] | null;
  favoriteProducts: Inventory[] | null;
  originalProducts: Inventory[] | null;
  buckets: (Bucket & { inventory: Inventory | null })[];
  bucketMap: Map<number, Bucket & { inventory: Inventory | null }>;
  scheduleMap: Map<string, ScheduleEntry>;
  cartItems: Cart[];
  isLoading: boolean;
  isFetchingBuckets: boolean;
  fetchError: string;
  bucketMode: boolean;
  selectedStore: Store | null;
  handleResync: () => void;
  handleRefreshBuckets: () => void;
  setCartItems: Dispatch<SetStateAction<Cart[]>>;
  setBucketMode: Dispatch<SetStateAction<boolean>>;
  setClientSideItems: Dispatch<SetStateAction<Inventory[] | null>>;
}) => {
  return (
    <PosContext.Provider
      value={{
        inventoryItems,
        cartItems,
        isLoading,
        isFetchingBuckets,
        fetchError,
        selectedStore,
        favoriteProducts,
        originalProducts,
        buckets,
        bucketMap,
        bucketMode,
        scheduleMap,
        handleResync,
        handleRefreshBuckets,
        setCartItems,
        setClientSideItems,
        setBucketMode,
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
