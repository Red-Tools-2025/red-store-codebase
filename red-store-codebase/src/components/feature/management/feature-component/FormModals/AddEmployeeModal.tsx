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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
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
  onStoreAdded: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onStoreAdded,
}) => {
  const { toast } = useToast();
  const { sessionData } = useManagement();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      storeId: "",
      roleId: "",
      empName: "",
      empPhone: "",
      empStatus: true,
      storeManagerId: sessionData?.id || "",
    },
    validationSchema: Yup.object({
      storeId: Yup.number().required("Store ID is required"),
      roleId: Yup.number().required("Please select employee role type"),
      empName: Yup.string().required("Employee name is required"),
      empPhone: Yup.string().required("Employee phone is required"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const requestBody: AddEmployeeRequestBody = {
          storeId: Number(values.storeId),
          roleId: Number(values.roleId),
          empName: values.empName,
          empPhone: values.empPhone,
          empStatus: values.empStatus,
          storeManagerId: values.storeManagerId,
        };

        const { data } = await axios.post<AddEmployeeResponse>(
          "/api/management/employees",
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        toast({
          title: "Success",
          description: data.message,
          variant: "default",
        });

        onStoreAdded();
        formik.resetForm();
        onClose();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            title: "Error",
            description:
              error.response?.data?.error ||
              "Failed to add employee. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
        }
        console.error("Error adding employee:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Fill in the details of the new employee.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="grid gap-4 py-4">
          <div className="flex-col">
            <Label htmlFor="storeId" className="text-right">
              Store ID
            </Label>
            <Input
              id="storeId"
              name="storeId"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.storeId}
              onBlur={formik.handleBlur}
              className="col-span-3"
            />
            {formik.touched.storeId && formik.errors.storeId ? (
              <div className="text-red-500 col-span-4">
                {formik.errors.storeId}
              </div>
            ) : null}
          </div>
          <div className="flex-col">
            <Label htmlFor="roleId" className="text-right">
              Role ID
            </Label>
            <Input
              id="roleId"
              name="roleId"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.roleId}
              onBlur={formik.handleBlur}
              className="col-span-3"
            />
            {formik.touched.roleId && formik.errors.roleId ? (
              <div className="text-red-500 col-span-4">
                {formik.errors.roleId}
              </div>
            ) : null}
          </div>
          <div className="flex-col">
            <Label htmlFor="empName" className="text-right">
              Employee Name
            </Label>
            <Input
              id="empName"
              name="empName"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.empName}
              onBlur={formik.handleBlur}
              className="col-span-3"
            />
            {formik.touched.empName && formik.errors.empName ? (
              <div className="text-red-500 col-span-4">
                {formik.errors.empName}
              </div>
            ) : null}
          </div>
          <div className="flex-col">
            <Label htmlFor="empPhone" className="text-right">
              Employee Phone
            </Label>
            <Input
              id="empPhone"
              name="empPhone"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.empPhone}
              onBlur={formik.handleBlur}
              className="col-span-3"
            />
            {formik.touched.empPhone && formik.errors.empPhone ? (
              <div className="text-red-500 col-span-4">
                {formik.errors.empPhone}
              </div>
            ) : null}
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
