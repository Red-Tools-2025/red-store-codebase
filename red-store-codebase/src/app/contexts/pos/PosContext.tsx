import {
  createContext,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { SessionUserType } from "@/app/types/management/context";
import { Inventory, Store } from "@prisma/client";
import { Cart } from "@/app/types/pos/cart";

interface PosContextType {
  inventoryItems: Inventory[] | null;
  favoriteProducts: Inventory[] | null;
  originalProducts: Inventory[] | null;
  cartItems: Cart[];
  isLoading: boolean;
  selectedStore: Store | null;
  handleResync: () => void;
  setCartItems: Dispatch<SetStateAction<Cart[]>>;
  setClientSideItems: Dispatch<SetStateAction<Inventory[] | null>>;
}

const PosContext = createContext<PosContextType | undefined>(undefined);

export const PosProvider = ({
  children,
  inventoryItems,
  cartItems,
  isLoading,
  selectedStore,
  favoriteProducts,
  originalProducts,
  handleResync,
  setCartItems,
  setClientSideItems,
}: {
  children: ReactNode;
  inventoryItems: Inventory[] | null;
  favoriteProducts: Inventory[] | null;
  originalProducts: Inventory[] | null;
  cartItems: Cart[];
  isLoading: boolean;
  selectedStore: Store | null;
  handleResync: () => void;
  setCartItems: Dispatch<SetStateAction<Cart[]>>;
  setClientSideItems: Dispatch<SetStateAction<Inventory[] | null>>;
}) => {
  return (
    <PosContext.Provider
      value={{
        inventoryItems,
        cartItems,
        isLoading,
        selectedStore,
        favoriteProducts,
        originalProducts,
        handleResync,
        setCartItems,
        setClientSideItems,
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
