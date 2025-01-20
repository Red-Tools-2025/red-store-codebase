import { createContext, useContext, ReactNode } from "react";
import { SessionUserType } from "@/app/types/management/context";

interface PosContextType {
  sessionData: SessionUserType | null;
}

const PosContext = createContext<PosContextType | undefined>(undefined);

export const PosProvider = ({
  children,
  sessionData,
}: {
  children: ReactNode;
  sessionData: SessionUserType | null;
}) => {
  return (
    <PosContext.Provider
      value={{
        sessionData,
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
