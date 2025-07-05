"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import useStoreServerFetch from "@/app/hooks/management/ServerHooks/useStoreServerFetch";
import { Store } from "@prisma/client";
import { useAuth } from "@/app/providers/AuthProvider";

interface StoreContextType {
  selectedStore: Store | null;
  setSelectedStore: (store: Store | null) => void;
  storeData: Store[] | null;
  isLoading: boolean;
  handleStoreDataRefresh: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  const userId = session?.user?.id ?? "";

  const {
    data: storeData,
    isLoading,
    handleRefresh: handleStoreDataRefresh,
  } = useStoreServerFetch(userId);

  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  useEffect(() => {
    // Optional: auto-select first store
    if (storeData && storeData.length > 0 && !selectedStore) {
      setSelectedStore(storeData[0]);
    }
  }, [storeData]);

  return (
    <StoreContext.Provider
      value={{
        selectedStore,
        setSelectedStore,
        storeData,
        isLoading,
        handleStoreDataRefresh,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStoreContext must be used within a StoreProvider");
  }
  return context;
};
