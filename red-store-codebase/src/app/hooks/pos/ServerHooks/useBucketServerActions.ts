import {
  CreateBucketRequestBody,
  CreateBucketResponseBody,
  BucketStatusRequestBody,
  DeleteBucketRequestBody,
} from "@/app/types/buckets/api";
import axios, { AxiosResponse } from "axios";
import { Dispatch, SetStateAction, useState } from "react";

const useBucketServerActions = () => {
  /* States for creation */
  const [isCreating, setIsCreating] = useState(false);
  const [createBucketError, setCreateBucketError] = useState("");

  /* States for activation */
  const [isActivating, setIsActivating] = useState(false);
  const [activateError, setActivateError] = useState("");
  const [pendingActivation, setPendingActivation] =
    useState<BucketStatusRequestBody | null>(null);

  /* States for deletion */
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>("");

  /* All dialog states */
  const [dialogType, setDialogType] = useState<
    "ACTIVATE" | "DELETE" | "COMPLETE" | "FINISHED" | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");

  /* Hook call for creating a bucket */
  const handleCreateBucket = async (body: CreateBucketRequestBody) => {
    setCreateBucketError("");
    setIsCreating(true);
    try {
      const response: AxiosResponse<CreateBucketResponseBody> =
        await axios.post("/api/bucket", body);
      setIsCreating(false);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setCreateBucketError(
          error.response.data.error || "Error creating bucket"
        );
      } else {
        setCreateBucketError("Error creating bucket");
      }
      setIsCreating(false);
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
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setActivateError(
          error.response.data.error || "Error updating bucket status"
        );
      } else {
        setActivateError("Error updating bucket status");
      }
      setIsActivating(false);
    }
  };

  /* Handle Bucket delete actions */

  /* Action to trigger modal to verify delete */
  const handleAwaitDelete = async (
    buckets: { bucket_id: number; store_id: number }[]
  ) => {
    console.log({ buckets });
    setDialogType("DELETE");
    setIsDialogOpen(true);
  };

  const handleBucketDelete = async (body: DeleteBucketRequestBody) => {
    try {
      setIsDeleting(true);
      const response: AxiosResponse<{ message: string }> = await axios.delete(
        "/api/bucket",
        { data: body }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setDeleteError(error.response.data.error || "Error deleting bucket");
      } else {
        setDeleteError("Error deleting bucket");
      }
    } finally {
      setIsDeleting(false);
    }
  };
  /* Verification and confirmation actions */

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
    /* Creation exports */
    handleCreateBucket,
    isCreating,
    createBucketError,

    /* Activation exports */
    handleActivate,
    confirmActivation,
    isActivating,
    activateError,

    // closeDialog,

    /* Deletion exports */
    handleAwaitDelete,
    handleBucketDelete,
    isDeleting,
    deleteError,

    /* Dialog exports */
    setDialogType,
    setIsDialogOpen,
    dialogType,
    dialogMessage,
    isDialogOpen,
  };
};

export default useBucketServerActions;
