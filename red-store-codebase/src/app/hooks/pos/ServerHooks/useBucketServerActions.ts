import {
  CreateBucketRequestBody,
  CreateBucketResponseBody,
  DeleteBucketRequestBody,
} from "@/app/types/buckets/api";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";

const useBucketServerActions = () => {
  const { toast } = useToast();
  /* States for creation */
  const [isCreating, setIsCreating] = useState(false);
  const [createBucketError, setCreateBucketError] = useState("");

  /* States for activation */
  const [isActivating, setIsActivating] = useState(false);
  const [activateError, setActivateError] = useState("");

  /* States for deletion */
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>("");

  /* States for finishing */
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  const [finishError, setFinishError] = useState<string>("");

  /* All dialog states */
  const [dialogType, setDialogType] = useState<
    "ACTIVATE" | "DELETE" | "COMPLETE" | "FINISHED" | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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

  const handleAwaitActivate = async (
    bucket_id: number,
    store_id: number,
    scheduled_time: string
  ) => {
    // Check if the activation time is before the scheduled time
    const scheduledTime = new Date(scheduled_time);
    const currentTime = new Date();

    // Prompt the confirmation modal, only if activation preceeds scheduled time
    if (scheduledTime > currentTime) {
      setDialogType("ACTIVATE");
      setIsDialogOpen(true);
    }

    await handleActivate(bucket_id, store_id);
  };

  /* Hook call for activating (or pausing) a bucket */
  const handleActivate = async (bucket_id: number, store_id: number) => {
    try {
      setIsActivating(true);
      const response: AxiosResponse<{ message: string }> = await axios.post(
        "/api/bucket/status",
        {
          bucketId: bucket_id,
          storeId: store_id,
          status: "ACTIVE",
        }
      );
      setDialogType(null);
      setIsDialogOpen(false);
      toast({
        title: "Bucket Now Active",
        duration: 3000,
        description: response.data.message,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setActivateError(
          error.response.data.error || "Error Activating bucket, try again"
        );
      } else {
        setActivateError("Error Activating bucket, try again");
      }
    } finally {
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

  /* Handler for marking bucket as finished */
  const handleFinish = async (bucket_id: number, store_id: number) => {
    try {
      setIsFinishing(true);
      const response: AxiosResponse<{ message: string }> = await axios.post(
        "/api/bucket/status",
        {
          bucketId: bucket_id,
          storeId: store_id,
          status: "FINISHED",
        }
      );
      toast({
        title: "Bucket Status Updated",
        duration: 3000,
        description: response.data.message,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setFinishError(
          error.response.data.error || "Error Activating bucket, try again"
        );
      } else {
        setFinishError("Error Activating bucket, try again");
      }
    } finally {
      setIsFinishing(false);
    }
  };

  return {
    /* Creation exports */
    handleCreateBucket,
    isCreating,
    createBucketError,

    /* Activation exports */
    handleActivate,
    handleAwaitActivate,
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
    isDialogOpen,

    /* Finishing exports */
    handleFinish,
    isFinishing,
    finishError,
  };
};

export default useBucketServerActions;
