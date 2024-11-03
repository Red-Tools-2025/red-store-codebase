"use client";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FilterDropdown from "../Filter";
import { Store } from "@prisma/client";

interface StoreTableControllerProps {
  setSearchValue: Dispatch<SetStateAction<String>>;
  storeData: Store[] | null;
}

const StoreTableController: React.FC<StoreTableControllerProps> = ({
  setSearchValue,
  storeData,
}) => {
  const [locations, setLocations] = useState<
    { value: string; label: string }[]
  >([]);

  // Effect to watch for updates in storeData
  useEffect(() => {
    if (storeData) {
      // ensure only unique store values, hence relevant options for filtering data
      const uniqueLocations = storeData.reduce<
        { value: string; label: string }[]
      >((accumulator, store) => {
        if (
          store.storeLocation &&
          !accumulator.some((item) => item.value === store.storeLocation)
        ) {
          accumulator.push({
            value: store.storeLocation,
            label: store.storeLocation,
          });
        }
        return accumulator;
      }, []);
      setLocations(uniqueLocations);
    } else {
      setLocations([]);
    }
  }, [storeData]);

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
