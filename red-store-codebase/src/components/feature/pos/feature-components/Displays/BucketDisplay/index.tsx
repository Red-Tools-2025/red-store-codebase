import BucketTable from "../Tables/BucketsTable";
import { Bucket, Inventory } from "@prisma/client";

interface BucketDisplayProps {
  buckets: (Bucket & { inventory: Inventory | null })[];
  isFetching: boolean;
  fetchError: string;
}

const BucketDisplay: React.FC<BucketDisplayProps> = ({
  buckets,
  fetchError,
  isFetching,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {isFetching ? (
        <p>Loading Buckets...</p>
      ) : (
        <>
          {fetchError === "" ? (
            <BucketTable buckets={buckets} />
          ) : (
            <p>Something went wrong while fetching buckets</p>
          )}
        </>
      )}
    </div>
  );
};

export default BucketDisplay;
