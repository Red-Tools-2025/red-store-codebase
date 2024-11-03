import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Store } from "@prisma/client";
import { useState } from "react";
import { IoMdArrowDropdownCircle } from "react-icons/io";

interface DropDownStoreSelectProps {
  isDisabled: boolean;
  data: Store[];
}

const DropDownStoreSelect: React.FC<DropDownStoreSelectProps> = ({
  isDisabled,
  data,
}) => {
  const [selectedOutlet, setSelectedOutLet] = useState<Store | null>(null);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isDisabled}
        className={`bg-[#344054] text-accent px-3 rounded-sm shadow ${
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="flex items-center">
          {`${selectedOutlet ? selectedOutlet.storeName : "Select Outlet"}`}
          <IoMdArrowDropdownCircle className="ml-2 text-lg color-white" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        {data && data.length > 0 ? (
          data.map((store) => (
            <DropdownMenuItem
              onClick={() => setSelectedOutLet(store)}
              className="cursor-pointer"
              key={store.storeId}
            >
              {store.storeName}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuLabel>No stores available</DropdownMenuLabel>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownStoreSelect;
