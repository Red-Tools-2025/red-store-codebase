import axios, { AxiosError } from "axios";
import { Employee as PrismaEmployee } from "@prisma/client"; // Adjust the import if needed
import { useState, useEffect } from "react";
interface Role {
  roleType: string; // Assuming roleType is the field you want to display
}

// Extend the existing Employee type to include role
interface Employee extends PrismaEmployee {
  role: Role; // Now Employee has a role field
}

interface FetchEmployeesResult {
  data: Employee[] | null;
  isLoading: boolean;
  error: string | null;
}

interface EmployeesResponse {
  emp_for_manager: Employee[]; // Adjust this according to your actual response structure
}

const useEmployeeServerFetch = (
  storeManagerID: string | null
): FetchEmployeesResult => {
  const [data, setData] = useState<Employee[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeManagerID) return;

    const fetchEmployees = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await axios.get<EmployeesResponse>(`/api/management/employees`, {
          params: { storeManagerID },
          headers: { "Content-Type": "application/json" },
        });

        if (res.data.emp_for_manager) {
          setData(res.data.emp_for_manager);
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [storeManagerID]);

  return { data, isLoading, error };
};

export default useEmployeeServerFetch;
