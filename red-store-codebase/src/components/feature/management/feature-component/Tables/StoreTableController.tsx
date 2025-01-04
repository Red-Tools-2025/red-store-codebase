"use client";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";
import FilterDropdown from "../Filter";
import { Store } from "@prisma/client";

interface StoreTableControllerProps {
  setSearchValue: Dispatch<SetStateAction<string>>;
  setLocationFilterValue: Dispatch<SetStateAction<string>>;
  setStatusFilterValue: Dispatch<SetStateAction<string>>;
  storeData: Store[] | null;
  locations: { value: string; label: string }[];
}

const StoreTableController: React.FC<StoreTableControllerProps> = ({
  setSearchValue,
  storeData,
  locations,
  setLocationFilterValue,
  setStatusFilterValue,
}) => {
  const statuses = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div className="flex gap-3 justify-space">
      {storeData ? (
        <>
          <Input
            placeholder="search store"
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className="flex gap-2">
            <FilterDropdown
              label={`Locations`}
              options={locations}
              onValueChange={(value) => setLocationFilterValue(value)}
            />
            <FilterDropdown
              label={`Status`}
              options={statuses}
              onValueChange={(value) => setStatusFilterValue(value)}
            />
          </div>
        </>
      ) : (
        <div className="px-3 py-1 rounded-sm bg-red-200 text-red-600">
          No store data available to process
        </div>
      )}
    </div>
  );
};

export default StoreTableController;
