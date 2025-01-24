import {
  createContext,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { SessionUserType } from "@/app/types/management/context";
import { Inventory } from "@prisma/client";
import { Cart } from "@/app/types/pos/cart";

interface PosContextType {
  sessionData: SessionUserType | null;
  inventoryItems: Inventory[] | null;
  cartItems: Cart[];
  isLoading: boolean;
  handleRefresh: () => void;
  setCartItems: Dispatch<SetStateAction<Cart[]>>;
}

const PosContext = createContext<PosContextType | undefined>(undefined);

export const PosProvider = ({
  children,
  sessionData,
  inventoryItems,
  cartItems,
  isLoading,
  handleRefresh,
  setCartItems,
}: {
  children: ReactNode;
  sessionData: SessionUserType | null;
  inventoryItems: Inventory[] | null;
  cartItems: Cart[];
  isLoading: boolean;
  handleRefresh: () => void;
  setCartItems: Dispatch<SetStateAction<Cart[]>>;
}) => {
  return (
    <PosContext.Provider
      value={{
        sessionData,
        inventoryItems,
        cartItems,
        isLoading,
        handleRefresh,
        setCartItems,
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
