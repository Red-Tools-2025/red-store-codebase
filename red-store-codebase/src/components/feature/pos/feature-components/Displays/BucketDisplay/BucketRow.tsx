import { Bucket, Inventory } from "@prisma/client";

interface BucketRowProps {
  bucket: Bucket & { inventory: Inventory | null };
}
const BucketRow: React.FC<BucketRowProps> = ({ bucket }) => {
  return <p>Here is {bucket.bucketId}</p>;
};

export default BucketRow;
