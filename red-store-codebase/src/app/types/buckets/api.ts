import { BucketSize, BucketStatus } from "@prisma/client";

export interface CreateBucketRequestBody {
  storeId: number;
  storeManagerId: string;
  scheduledTime: Date;
  bucket_item_details: {
    invId: number;
    bucketQty: BucketSize;
  };
}

export interface UpdateBucketRequestBody {
  bucketId: number;
  storeId: number;
  storeManagerId: string;
  scheduledTime: Date;
  bucketQty: BucketSize;
}

export interface DeleteBucketRequestBody {
  buckets: {
    bucketId: number;
    storeId: number;
  }[];
}

export interface BucketStatusRequestBody {
  bucketId: number;
  storeId: number;
  status: BucketStatus;
  soldQty: number;
}

export interface FetchBucketListsRequestBody {
  bucketId: number;
  storeId: number;
}
