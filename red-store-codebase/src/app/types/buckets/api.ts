import { BucketSize } from "@prisma/client";

export interface CreateBucketResponseBody {
  storeId: number;
  duration: number;
  storeManagerId: string;
  allotedDeadline: Date;
}

export interface AddBucketItemsBulkRequestBody {
  bucketId: number;
  storeId: number;
  bucket_items: {
    invId: number;
    bucketQty: BucketSize;
  }[];
}

export interface EmptyBucketListRequestBody {
  bucketId: number;
}
