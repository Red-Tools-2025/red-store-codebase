import { Store } from "@prisma/client";

// interface for response of get-store endpoint
export interface GetEmployeeStoreResponse {
  store: Store;
  message: string;
}
