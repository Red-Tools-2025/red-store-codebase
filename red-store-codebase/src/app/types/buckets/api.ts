import { BucketSize } from "@prisma/client";

export interface CreateBucketResponseBody {
  storeId: number;
  duration: number;
  storeManagerId: string;
  allotedDeadline: Date;
}

export interface AddBucketItemRequestBody {
  bucketId: number;
  storeId: number;
  bucket_item: {
    invId: number;
    bucketQty: BucketSize;
  };
}
