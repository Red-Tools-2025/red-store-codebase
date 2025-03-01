import { BucketSize } from "@prisma/client";

export interface CreateBucketResponseBody {
  storeId: number;
  duration: number;
  storeManagerId: string;
  scheduledTime: Date;
  bucket_item_details: {
    invId: number;
    bucketQty: BucketSize;
  };
}

export interface BucketStatusRequestBody {
  bucketId: number;
  storeId: number;
  status: boolean;
}

export interface FetchBucketListsRequestBody {
  bucketId: number;
  storeId: number;
}
