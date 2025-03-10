import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnFiltersState } from "@tanstack/react-table";
import { Dispatch, SetStateAction, useState } from "react";
import { IoIosClose } from "react-icons/io";

interface SelectFilterTypeProps {
  selectFilterId: string;
  selectLabel: string;
  selectPlaceHolder: string;
  selectOptions: { value: string; label: string }[];
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
}

const SelectFilterType: React.FC<SelectFilterTypeProps> = ({
  selectFilterId,
  selectLabel,
  selectPlaceHolder,
  selectOptions,
  setColumnFilters,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );
  const [activeFilter, setActiveFilter] = useState<boolean>(false);

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
    setActiveFilter(true);
    setColumnFilters((prevFilters) => {
      if (!value) return prevFilters.filter((f) => f.id !== selectFilterId);
      return [
        ...prevFilters.filter((f) => f.id !== selectFilterId),
        { id: selectFilterId, value },
      ];
    });
  };

  const clearFilter = () => {
    setActiveFilter(false);
    setSelectedOption(undefined);
    setColumnFilters((prevFilters) =>
      prevFilters.filter((f) => f.id !== selectFilterId)
    );
  };

  return (
    <div className="relative flex items-center gap-2">
      <Select value={selectedOption || ""} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-fit">
          <SelectValue placeholder={selectPlaceHolder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{selectLabel}</SelectLabel>
            {selectOptions.map((option, i) => (
              <SelectItem key={i} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Show clear button only if a filter is active */}
      {activeFilter && (
        <IoIosClose
          size={20}
          className="cursor-pointer hover:text-red-500"
          onClick={clearFilter}
        />
      )}
    </div>
  );
};

export default SelectFilterType;
