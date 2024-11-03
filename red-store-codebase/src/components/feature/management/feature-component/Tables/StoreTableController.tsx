import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";

interface StoreTableControllerProps {
  setSearchValue: Dispatch<SetStateAction<String>>;
}
const StoreTableController: React.FC<StoreTableControllerProps> = ({
  setSearchValue,
}) => {
  return (
    <div className="flex">
      <Input
        placeholder="search store"
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );
};

export default StoreTableController;
