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

export interface AddBucketItemRequestBody {
  bucketId: number;
  storeId: number;
  bucket_item: {
    invId: number;
    bucketQty: BucketSize;
  };
}

export interface EmptyBucketListRequestBody {
  bucketId: number;
}

export interface FetchBucketListsRequestBody {
  bucketId: number;
  storeId: number;
}
