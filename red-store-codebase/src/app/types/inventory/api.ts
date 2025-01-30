/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonValue } from "@prisma/client/runtime/library";
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
    product_name: string;
    product_price: number;
    productQuantity: number;
  }[];
  store_id: number;
  purchase_time?: string; // defaults to today, just for testing
}

export interface ProcessBulkCartRequest {
  sales_records: {
    purchases: {
      product_id: number;
      product_current_stock: number;
      product_name: string;
      product_price: number;
      productQuantity: number;
    }[];
    purchase_time: string;
  }[]; // Array of cart items for bulk processing
  store_id: number;
}

export type TimeSeries =
  Database["public"]["Tables"]["inventory_timeseries"]["Row"];

export interface InventoryCustomFieldsRequestBody {
  storeId: number;
  storeManagerId: string;
  customfields: {
    fieldName: string;
    label: string;
    type: string;
    allowedValues?: string[];
  }[];
}

export interface InventoryCustomFieldsResponseBody {
  message: string;
  store: {
    storeId: number;
    storeName: string;
    storeLocation: string | null;
    storeManagerId: string;
    storeStatus: boolean;
    createdAt: Date | null;
    customfields: JsonValue | null;
  };
}
