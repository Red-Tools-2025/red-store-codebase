//interface for the incoming request body for adding inventory
export interface AddInventoryRequestBody {
  storeId: string; // Store ID received as a string
  storeManagerId: string; // Assuming this is a user ID
  invItem: string;
  invItemBrand: string;
  invItemStock: number;
  invItemPrice: number;
  invItemType: string;
  invItemBarcode: number;
  invItemSize: number;
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
    invItemBarcode: number;
    invItemSize: number;
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
    invItemBarcode: number;
    invItemSize: number;
    invAdditional?: any;
  }[];
}

export interface DeleteProductBatchRequestBody {
  productBatch: {
    productId: number;
    storeId: number;
  }[];
}
