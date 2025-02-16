import { GetEmployeeStoreResponse } from "@/app/types/emp/api";
import { Store } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { Dispatch, SetStateAction } from "react";

const useEmpDetails = () => {
  const handleGetEmployeeStore = async (
    store_id: number,
    store_manager_id,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    setError: Dispatch<SetStateAction<string>>,
    setSelectedStore: Dispatch<SetStateAction<Store>>
  ) => {
    setError("");
    setIsLoading(true);
    try {
      const response: AxiosResponse<GetEmployeeStoreResponse> = await axios.get(
        "/api/emp/get-store",
        {
          params: {
            store_id,
            store_manager_id,
          },
        }
      );

      const {
        data: { message, store },
      } = response;
      console.log(message);
      setSelectedStore(store);
    } catch (error) {
      console.error(`Something went wrong while getting stores : ${error}`);
      if (axios.isAxiosError(error) && error.response) {
        setError(
          error.response.data.error ||
            "An error occured while getting store details"
        );
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleGetEmployeeStore };
};

export default useEmpDetails;
