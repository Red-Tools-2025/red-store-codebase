import { Store } from "@prisma/client";
import StoreTableController from "../../Tables/StoreTableController";
import StoreDataTable from "../../Tables/StoreDataTable";
import { useEffect, useState } from "react";

interface StoreControlPanelProps {
  storeData: Store[] | null;
}

const StoreControlPanel: React.FC<StoreControlPanelProps> = ({ storeData }) => {
  const [searchTableController, setSearchTableController] =
    useState<String>("");
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

  return (
    <div className="flex-col w-1/2">
      <StoreTableController
        locations={locations}
        storeData={storeData}
        setSearchValue={setSearchTableController}
      />
      <StoreDataTable storeData={storeData} />
    </div>
  );
};

export default StoreControlPanel;
