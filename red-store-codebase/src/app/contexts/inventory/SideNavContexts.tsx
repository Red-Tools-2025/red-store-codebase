// contexts/SideNavContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface SideNavContextType {
  isOpen: boolean;
  handleSideNavOpen: () => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const SideNavContext = createContext<SideNavContextType | undefined>(undefined);

interface SideNavProviderProps {
  children: ReactNode;
}

export const SideNavProvider: React.FC<SideNavProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSideNavOpen = () => setIsOpen(true);

  return (
    <SideNavContext.Provider value={{ isOpen, handleSideNavOpen, setIsOpen }}>
      {children}
    </SideNavContext.Provider>
  );
};

export const useSideNav = (): SideNavContextType => {
  const context = useContext(SideNavContext);
  if (context === undefined) {
    throw new Error("useSideNav must be used within a SideNavProvider");
  }
  return context;
};
