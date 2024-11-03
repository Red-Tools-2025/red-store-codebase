"use client";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FilterDropdown from "../Filter";
import { Store } from "@prisma/client";

interface StoreTableControllerProps {
  setSearchValue: Dispatch<SetStateAction<String>>;
  storeData: Store[] | null;
  locations: { value: string; label: string }[];
}

const StoreTableController: React.FC<StoreTableControllerProps> = ({
  setSearchValue,
  storeData,
  locations,
}) => {
  //   const [locations, setLocations] = useState<
  //     { value: string; label: string }[]
  //   >([]);

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
              label="Location"
              options={locations}
              onValueChange={(value) => console.log("Location:", value)}
            />
            <FilterDropdown
              label="Status"
              options={statuses}
              onValueChange={(value) => console.log("Status:", value)}
            />
          </div>
        </>
      ) : (
        <div className="px-3 py-1 rounded-sm bg-red-200 text-red-600 ">
          No store data available to process
        </div>
      )}
    </div>
  );
};

export default StoreTableController;
