import {
  CreateBucketRequestBody,
  CreateBucketResponseBody,
  BucketStatusRequestBody,
} from "@/app/types/buckets/api";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";

const useBucketServerActions = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [createBucketError, setCreateBucketError] = useState("");
  const [isActivating, setIsActivating] = useState(false);
  const [activateError, setActivateError] = useState("");

  /* Hook call for creating a bucket */
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

  /* Hook call for activating (or pausing) a bucket */
  const handleActivate = async (body: BucketStatusRequestBody) => {
    setActivateError("");
    setIsActivating(true);
    try {
      const response: AxiosResponse<{ message: string }> = await axios.post(
        "/api/bucket/status",
        body
      );
      setIsActivating(false);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setActivateError(
          error.response.data.error || "Error updating bucket status"
        );
      } else {
        setActivateError("Error updating bucket status");
      }
      setIsActivating(false);
      throw error;
    }
  };

  return {
    handleCreateBucket,
    isCreating,
    createBucketError,
    handleActivate,
    isActivating,
    activateError,
  };
};

export default useBucketServerActions;
