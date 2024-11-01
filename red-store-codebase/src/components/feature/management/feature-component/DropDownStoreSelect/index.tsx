import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoMdArrowDropdownCircle } from "react-icons/io";

interface DropDownStoreSelectProps {
  isDisabled: boolean;
}

const DropDownStoreSelect: React.FC<DropDownStoreSelectProps> = ({
  isDisabled,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isDisabled}
        className={`bg-[#344054] text-accent px-3 rounded-sm shadow ${
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="flex items-center">
          Select outlet
          <IoMdArrowDropdownCircle className="ml-2 text-lg color-white" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownStoreSelect;
