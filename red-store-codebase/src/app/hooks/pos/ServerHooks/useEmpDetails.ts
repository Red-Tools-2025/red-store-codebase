import { GetEmployeeStoreResponse } from "@/app/types/emp/api";
import { Store } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

const useEmpDetails = (store_id: number, store_manager_id: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [store, setSelectedStore] = useState<Store | null>(null);

  useEffect(() => {
    if (!store_id || !store_manager_id) return;

    const handleGetEmployeeStore = async () => {
      setIsLoading(true);
      try {
        const response: AxiosResponse<GetEmployeeStoreResponse> =
          await axios.get("/api/emp/get-store", {
            params: {
              store_id,
              store_manager_id,
            },
          });

        const {
          data: { message, store },
        } = response;
        console.log(message);
        setSelectedStore(store);
      } catch (error) {
        console.error(`Something went wrong while getting stores : ${error}`);
        if (axios.isAxiosError(error) && error.response) {
          console.log(
            error.response.data.error ||
              "An error occured while getting store details"
          );
        } else {
          console.log("Something went wrong");
        }
      } finally {
        setIsLoading(false);
      }
    };

    handleGetEmployeeStore();
  }, [store_id, store_manager_id]);

  return { store, isLoading };
};

export default useEmpDetails;
