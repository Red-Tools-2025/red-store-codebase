import { useManagement } from "@/app/contexts/management/ManagementContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useToast } from "@/hooks/use-toast";
import { AddEmployeeRequestBody } from "@/app/types/management/employee";

// Interface for the API response data
interface Employee {
  id: number;
  storeId: number;
  roleId: number;
  empName: string;
  empPhone: string;
  empStatus: boolean;
  storeManagerId: string;
  createdAt: string;
}

interface AddEmployeeResponse {
  message: string;
  employee: Employee;
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const { sessionData, selectedStore } = useManagement();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const roleOptions = [
    { id: 1, name: "SALES" },
    { id: 3, name: "INVENTORY_STAFF" },
  ];

  const formik = useFormik({
    initialValues: {
      storeId: selectedStore?.storeId,
      roleId: "",
      empName: "",
      empPhone: "",
      empStatus: true,
      storeManagerId: sessionData?.id || "",
    },
    validationSchema: Yup.object({
      roleId: Yup.number().required("Please select employee role type"),
      empName: Yup.string().required("Employee name is required"),
      empPhone: Yup.string().required("Employee phone is required"),
    }),
    // onSubmit: async (values) => {
    //   setIsSubmitting(true);
    //   try {
    //     const requestBody: AddEmployeeRequestBody = {
    //       storeId: Number(values.storeId),
    //       roleId: Number(values.roleId),
    //       empName: values.empName,
    //       empPhone: values.empPhone,
    //       empStatus: values.empStatus,
    //       storeManagerId: values.storeManagerId,
    //     };

    //     const { data } = await axios.post<AddEmployeeResponse>(
    //       "/api/management/employees",
    //       requestBody,
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );

    //     toast({
    //       title: "Success",
    //       description: data.message,
    //       variant: "default",
    //     });

    //     formik.resetForm();
    //     onClose();
    //   } catch (error) {
    //     if (axios.isAxiosError(error)) {
    //       toast({
    //         title: "Error",
    //         description:
    //           error.response?.data?.error ||
    //           "Failed to add employee. Please try again.",
    //         variant: "destructive",
    //       });
    //     } else {
    //       toast({
    //         title: "Error",
    //         description: "An unexpected error occurred. Please try again.",
    //         variant: "destructive",
    //       });
    //     }
    //     console.error("Error adding employee:", error);
    //   } finally {
    //     setIsSubmitting(false);
    //   }
    // },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    if (selectedStore?.storeId) {
      formik.setFieldValue("storeId", selectedStore.storeId);
    }
  }, [selectedStore]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign employee to store</DialogTitle>
          <DialogDescription>
            {`Re-assign an employee from ${selectedStore?.storeId}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="py-4">
          <div className="flex">
            <div className="flex-col">
              <Label htmlFor="roleId" className="text-right">
                Employee
              </Label>
              <Select
                name="roleId"
                onValueChange={(value) => formik.setFieldValue("roleId", value)}
                value={formik.values.roleId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formik.touched.roleId && formik.errors.roleId ? (
                <div className="text-red-500 col-span-4">
                  {formik.errors.roleId}
                </div>
              ) : null}
            </div>
            <div className="flex-col">
              <Label htmlFor="roleId" className="text-right">
                Employee
              </Label>
              <Select
                name="roleId"
                onValueChange={(value) => formik.setFieldValue("roleId", value)}
                value={formik.values.roleId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formik.touched.roleId && formik.errors.roleId ? (
                <div className="text-red-500 col-span-4">
                  {formik.errors.roleId}
                </div>
              ) : null}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal;
