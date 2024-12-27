import { Database } from "../../../../supabase/database.types";

//interface for the incoming request body for adding inventory
export interface AddInventoryRequestBody {
  storeId: string; // Store ID received as a string
  storeManagerId: string; // Assuming this is a user ID
  invItem: string;
  invItemBrand: string;
  invItemStock: number;
  invItemPrice: number;
  invItemType: string;
  invItemBarcode: string;
  invAdditional?: any; // Optional additional information
}

export interface DeleteProductRequestBody {
  productId: number;
  storeId: number;
}

export interface UpdateProductRequestBody {
  updates: {
    invItemBrand: string;
    invItemStock: number;
    invItemPrice: number;
    invItemType: string;
    invItemBarcode: string;
    invAdditional?: any; // Optional additional information
  };
  productId: number;
  storeId: number;
}

// interface for the incoming request body for adding batch to inventory
export interface AddBatchRequestBody {
  storeId: string; // Store ID received as a string
  storeManagerId: string; // Assuming this is a user ID
  products: {
    invItem: string;
    invItemBrand: string;
    invItemStock: number;
    invItemPrice: number;
    invItemType: string;
    invItemBarcode: string;
    invAdditional?: any;
  }[];
}

export interface DeleteProductBatchRequestBody {
  productBatch: {
    productId: number;
    storeId: number;
  }[];
}

export interface UpdateProductBatchRequestBody {
  productBatch: {
    productId: number;
    storeId: number;
    recievedStock: number;
  }[];
}

export interface ProcessCartRequestBody {
  cartItems: {
    product_id: number;
    product_current_stock: number;
    product_price: number;
    productQuantity: number;
  }[];
  store_id: number;
  purchase_time?: string; // defaults to today, just for testing
}

export type TimeSeries =
  Database["public"]["Tables"]["inventory_timeseries"]["Row"];
