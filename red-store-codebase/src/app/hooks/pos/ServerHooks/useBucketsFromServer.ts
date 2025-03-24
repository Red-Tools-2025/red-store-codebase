import { Bucket, Inventory } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

interface StoreBucketsFetchResponse {
  message: string;
  buckets: (Bucket & { inventory: Inventory | null })[];
}
const useBucketsFromServer = (store_id: string) => {
  /* 
  Bucket map is very important, as it not only provides a quick access mapping for everything but 
  also the relevant bucket details that will be required for keeping the client side up to date 
  */
  const [bucketMap, setBucketMap] = useState<
    Map<number, Bucket & { inventory: Inventory | null }>
  >(new Map());
  const [buckets, setBuckets] = useState<
    (Bucket & { inventory: Inventory | null })[]
  >([]);
  const [refreshBuckets, setRefreshBuckets] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string>("");

  const handleRefreshBuckets = () => {
    setRefreshBuckets(!refreshBuckets);
  };

  /* Effect for loading in bucket data */
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
          /* Create the bucket map */
          const bMap = new Map(
            response.data.buckets.map((b) => [b.bucketId, b])
          );
          setBucketMap(bMap);
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
  }, [store_id, refreshBuckets]);

  return {
    buckets,
    isFetching,
    fetchError,
    bucketMap,
    handleRefreshBuckets,
  };
};

export default useBucketsFromServer;
