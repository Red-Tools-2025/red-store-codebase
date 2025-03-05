import {
  CreateBucketRequestBody,
  CreateBucketResponseBody,
} from "@/app/types/buckets/api";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";

const useBucketServerActions = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [createBucketError, setCreateBucketError] = useState("");

  /* Hook call for creating bucket */
  const handleCreateBucket = async (body: CreateBucketRequestBody) => {
    setCreateBucketError("");
    setIsCreating(true);
    try {
      const response: AxiosResponse<CreateBucketResponseBody> =
        await axios.post("/api/bucket", body);
      setIsCreating(false);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setCreateBucketError(
          error.response.data.error || "Error creating bucket"
        );
      } else {
        setCreateBucketError("Error creating bucket");
      }
      setIsCreating(false);
      throw error;
    }
  };

  return {
    handleCreateBucket,
    isCreating,
    createBucketError,
  };
};

export default useBucketServerActions;
