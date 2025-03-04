import { ColumnFiltersState } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";

interface BucketDisplayControl {
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
}
const BucketDisplayControl = () => {
  return;
};

export default BucketDisplayControl;
