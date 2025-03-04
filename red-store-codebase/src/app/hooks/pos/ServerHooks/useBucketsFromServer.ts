import { Bucket, Inventory } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

interface StoreBucketsFetchResponse {
  message: string;
  buckets: (Bucket & { inventory: Inventory | null })[];
}
const useBucketsFromServer = (store_id: string) => {
  const [buckets, setBuckets] = useState<
    (Bucket & { inventory: Inventory | null })[]
  >([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string>("");

  useEffect(() => {
    const fetchBucketData = async () => {
      if (!store_id) return;
      try {
        setIsFetching(true);
        const response: AxiosResponse<StoreBucketsFetchResponse> =
          await axios.get("/api/bucket", {
            params: { storeId: store_id },
          });
        if (response.status === 200) {
          setBuckets(response.data.buckets);
        } else {
          setBuckets([]);
        }
      } catch (error) {
        setFetchError(
          axios.isAxiosError(error) && error.response
            ? error.response.data.error
            : "Error fetching bucket data"
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchBucketData();
  }, [store_id]);

  return { buckets, isFetching, fetchError };
};

export default useBucketsFromServer;
