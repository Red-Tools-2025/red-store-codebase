import { BucketSize, BucketStatus } from "@prisma/client";
import { ColumnFiltersState } from "@tanstack/react-table";
import React, { Dispatch, SetStateAction } from "react";
import SelectFilterType from "./SelectFilterType";

interface BucketDisplayControlProps {
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
}

const BucketDisplayControl: React.FC<BucketDisplayControlProps> = ({
  setColumnFilters,
}) => {
  // const handleDateTimeFilter = ({ from, to }: { from: Date; to: Date }) => {
  //   setColumnFilters((prev) => [
  //     ...prev.filter((f) => f.id !== "scheduledTime"),
  //     { id: "scheduledTime", value: { from, to } },
  //   ]);
  // };
  return (
    <div className="flex flex-row gap-2">
      <SelectFilterType
        selectFilterId="bucketSize"
        selectLabel="Bucket Size"
        setColumnFilters={setColumnFilters}
        selectOptions={Object.keys(BucketSize)
          .filter((key) => BucketSize[key] !== BucketSize.ONE_FIFTY)
          .map((key) => ({
            value: key,
            label:
              BucketSize[key] === BucketSize.FIFTY
                ? "Mini Bucket"
                : "Large Bucket",
          }))}
        selectPlaceHolder="Bucket size"
      />
      <SelectFilterType
        selectFilterId="status"
        selectLabel="Bucket Status"
        setColumnFilters={setColumnFilters}
        selectOptions={Object.keys(BucketStatus).map((key) => ({
          value: key,
          label:
            BucketStatus[key] === BucketStatus.ACTIVE
              ? "Active"
              : BucketStatus[key] === BucketStatus.INACTIVE
              ? "INACTIVE"
              : "COMPLETED",
        }))}
        selectPlaceHolder="Bucket status"
      />
    </div>
  );
};

export default BucketDisplayControl;
