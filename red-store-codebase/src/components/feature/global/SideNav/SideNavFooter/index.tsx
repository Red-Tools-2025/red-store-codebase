import React from "react";
import { Button } from "@/components/ui/button";
import { useSideNav } from "@/app/contexts/inventory/SideNavContexts";

const SideNavFooter: React.FC = () => {
  const { isOpen, handleSideNavOpen } = useSideNav();

  return (
    <div className="flex flex-row bg-red max-w-400">
      <Button
        onClick={handleSideNavOpen}
        className="bg-yellow-500"
      >{`Open State: ${isOpen}`}</Button>
    </div>
  );
};

export default SideNavFooter;
