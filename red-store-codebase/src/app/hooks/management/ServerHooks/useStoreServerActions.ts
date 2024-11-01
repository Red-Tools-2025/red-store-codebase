import { employeeType } from "@/app/types/management/employee";
import { Dispatch, SetStateAction } from "react";

const useStoreServerActions = () => {
  const handleSubmit = async (
    formData: employeeType,
    setMessage: Dispatch<SetStateAction<string>>,
    setFormData: Dispatch<SetStateAction<employeeType>>,
    e: React.FormEvent
  ) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/management/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeId: Number(formData.storeId),
          roleId: Number(formData.roleId),
          empName: formData.empName,
          empPhone: formData.empPhone,
          empStatus: formData.empStatus === true,
          storeManagerId: formData.storeManagerId,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage(result.message);
        setFormData({
          storeId: "",
          roleId: "",
          empName: "",
          empPhone: "",
          empStatus: true,
          storeManagerId: "",
        });
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage("An error occurred while adding the employee.");
    }
  };
  return { handleSubmit };
};

export default useStoreServerActions;
