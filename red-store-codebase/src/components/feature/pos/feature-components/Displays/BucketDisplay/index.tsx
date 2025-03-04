import { usePos } from "@/app/contexts/pos/PosContext";
import useBucketsFromServer from "@/app/hooks/pos/ServerHooks/useBucketsFromServer";
import { useEffect } from "react";
import BucketRow from "./BucketRow";

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
      <p>Hi bucket display here</p>
      <div className="flex flex-col gap-1">
        {buckets.map((bucket, i) => {
          return <BucketRow bucket={bucket} key={i} />;
        })}
      </div>
    </div>
  );
};

export default BucketDisplay;
