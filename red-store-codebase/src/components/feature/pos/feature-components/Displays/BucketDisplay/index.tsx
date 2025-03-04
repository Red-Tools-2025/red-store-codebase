import { usePos } from "@/app/contexts/pos/PosContext";
import useBucketsFromServer from "@/app/hooks/pos/ServerHooks/useBucketsFromServer";
import { useEffect } from "react";
import BucketTable from "../Tables/BucketsTable";

const BucketDisplay = () => {
  const { selectedStore } = usePos();
  const { buckets, fetchError, isFetching } = useBucketsFromServer(
    selectedStore?.storeId?.toString() || ""
  );
  useEffect(() => {
    console.log(buckets);
  }, [isFetching]);

  return (
    <div className="flex flex-col gap-1">
      <BucketTable buckets={buckets} />
    </div>
  );
};

export default BucketDisplay;
