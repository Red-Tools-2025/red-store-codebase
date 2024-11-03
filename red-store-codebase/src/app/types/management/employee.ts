export interface AddEmployeeRequestBody {
  storeId: number | string; // Allow both number and string to handle conversion
  roleId: number;
  empName: string;
  empPhone: string;
  empStatus: boolean;
  storeManagerId: string; // This is used for partitioning
}

export interface employeeType {
  storeId: number | string; // Allow both number and string to handle conversion
  roleId: string;
  empName: string;
  empPhone: string;
  empStatus: boolean;
  storeManagerId: string; // This is used for partitioning
}
