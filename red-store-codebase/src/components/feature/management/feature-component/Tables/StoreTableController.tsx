import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";

interface StoreTableControllerProps {
  setSearchValue: Dispatch<SetStateAction<String>>;
}
const StoreTableController: React.FC<StoreTableControllerProps> = ({
  setSearchValue,
}) => {
  return (
    <div className="flex justify-space">
      <Input
        placeholder="search store"
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <div className="flex gap-2"></div>
    </div>
  );
};

export default StoreTableController;
