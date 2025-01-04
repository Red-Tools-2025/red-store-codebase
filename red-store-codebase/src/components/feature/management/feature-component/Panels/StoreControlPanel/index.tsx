import { Store } from "@prisma/client";
import StoreTableController from "../../Tables/StoreTableController";
import StoreDataTable from "../../Tables/StoreDataTable";
import { useEffect, useState } from "react";

interface StoreControlPanelProps {
  storeData: Store[] | null;
}

const StoreControlPanel: React.FC<StoreControlPanelProps> = ({ storeData }) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [locations, setLocations] = useState<
    { value: string; label: string }[]
  >([]);

  // states to handle filters
  const [locationFilterValue, setLocationFilterValue] = useState<string>("All");
  const [statusFilterValue, setStatusFilterValue] = useState<string>("All");

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

      // adding all options for default filtering
      setLocations(uniqueLocations);
    } else {
      setLocations([]);
    }
  }, [storeData]);

  return (
    <div className="flex-col w-1/2">
      <StoreTableController
        locations={locations}
        storeData={storeData}
        setSearchValue={setSearchValue}
        setLocationFilterValue={setLocationFilterValue}
        setStatusFilterValue={setStatusFilterValue}
      />
      <StoreDataTable
        statusFilterValue={statusFilterValue}
        locationFilterValue={locationFilterValue}
        searchValue={searchValue}
        storeData={storeData}
      />
    </div>
  );
};

export default StoreControlPanel;
