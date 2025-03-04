import { Bucket, Inventory } from "@prisma/client";
import axios, { AxiosResponse, isAxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";

interface StoreBucketsFetchResponse {
  message: string;
  buckets: {
    bucket_data: Bucket;
    inventory: Inventory;
  }[];
}

const useBuckets = () => {
  const handleFetchBucketData = async (
    store_id: string,
    setIsFetchingBucketData: Dispatch<SetStateAction<boolean>>,
    setFetchBucketError: Dispatch<SetStateAction<string>>,
    setBucketData: Dispatch<
      SetStateAction<{
        buckets: {
          bucket_data: Bucket;
          inventory: Inventory;
        }[];
      }>
    >
  ) => {
    try {
      setIsFetchingBucketData(true);
      const response: AxiosResponse<StoreBucketsFetchResponse> =
        await axios.get("/api/bucket", {
          params: {
            storeId: store_id,
          },
        });
      if (response.status === 200) {
        setBucketData({ buckets: response.data.buckets });
      } else {
        setBucketData({ buckets: [] });
      }
    } catch (error) {
      setFetchBucketError(
        axios.isAxiosError(error) && error.response
          ? error.response.data.error
          : "Error fetching bucket data"
      );
      setIsFetchingBucketData(false);
    } finally {
      setIsFetchingBucketData(false);
    }
  };

  return { handleFetchBucketData };
};

export default useBuckets;
