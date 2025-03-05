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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingActivation, setPendingActivation] =
    useState<BucketStatusRequestBody | null>(null);
  const [dialogMessage, setDialogMessage] = useState("");

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
  const handleActivate = async (
    body: BucketStatusRequestBody & { scheduledTime: string }
  ) => {
    // Check if the activation time is before the scheduled time
    const scheduledTime = new Date(body.scheduledTime);
    const currentTime = new Date();

    if (scheduledTime > currentTime) {
      // Time is before the scheduled time, show the confirmation dialog
      setDialogMessage(
        `The scheduled activation time is ${scheduledTime.toLocaleString()}. Are you sure you want to activate it now?`
      );
      setPendingActivation(body);
      setIsDialogOpen(true);
      return;
    }

    // If no dialog is needed, proceed with activation directly
    proceedWithActivation(body);
  };

  const proceedWithActivation = async (body: BucketStatusRequestBody) => {
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

  // Close dialog without confirming
  const closeDialog = () => {
    setIsDialogOpen(false);
    setPendingActivation(null);
  };

  // Confirm the action after verifying
  const confirmActivation = () => {
    if (pendingActivation) {
      proceedWithActivation(pendingActivation);
      setIsDialogOpen(false);
      setPendingActivation(null);
    }
  };

  return {
    handleCreateBucket,
    handleActivate,
    closeDialog,
    confirmActivation,
    isCreating,
    createBucketError,
    isActivating,
    activateError,
  };
};

export default useBucketServerActions;
