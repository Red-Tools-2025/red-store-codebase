import { BucketSize } from "@prisma/client";

export interface CreateBucketResponseBody {
  storeId: number;
  duration: number;
  storeManagerId: string;
  allotedDeadline: Date;
  bucket_item_details: {
    invId: number;
    bucketQty: BucketSize;
  };
}

export interface FetchBucketListsRequestBody {
  bucketId: number;
  storeId: number;
}
