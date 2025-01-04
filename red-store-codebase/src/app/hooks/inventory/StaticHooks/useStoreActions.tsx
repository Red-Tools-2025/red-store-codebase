/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  InventoryCustomFieldsRequestBody,
  InventoryCustomFieldsResponseBody,
} from "@/app/types/inventory/api";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";

const useStoreActions = () => {
  const { toast } = useToast();
  const handleCreateStoreDefinitions = async (
    request_body: InventoryCustomFieldsRequestBody,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    handleCloseConfirmationModal: () => void,
    handleCloseStoreDefinitionsModal: () => void
  ) => {
    try {
      const { customfields, storeId, storeManagerId } = request_body;
      setIsLoading(true);
      const create_custom_fields_response =
        await axios.post<InventoryCustomFieldsResponseBody>(
          "/api/stores/customfields",
          { storeId, storeManagerId, customfields }
        );
      setIsLoading(false);
      toast({
        title: "Success",
        description: `${create_custom_fields_response.data.message}`,
        variant: "default",
      });
      handleCloseConfirmationModal();
      handleCloseStoreDefinitionsModal();
    } catch (err: any) {
      console.error("Error creating store definitions:", err);
      // Check for specific error response from the API
      const errorMessage =
        err.response?.data?.error || "Failed to create store definitions";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  return {
    handleCreateStoreDefinitions,
  };
};

export default useStoreActions;
