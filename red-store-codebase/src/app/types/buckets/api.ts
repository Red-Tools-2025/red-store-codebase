import { BucketSize } from "@prisma/client";

export interface CreateBucketResponseBody {
  storeId: number;
  invId: number;
  invItemName: string;
  allotedDeadline: Date;
  bucketQty: BucketSize;
}
