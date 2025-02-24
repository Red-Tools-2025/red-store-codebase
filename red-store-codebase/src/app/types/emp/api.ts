import { Store } from "@prisma/client";

// interface for api request for store details
export interface GetEmployeeStoreRequestBody {
  store_id: number;
  store_manager_id: string;
}

// interface for response of get-store endpoint
export interface GetEmployeeStoreResponse {
  store: Store;
  message: string;
}
