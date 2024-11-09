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
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import axios from "axios";
import * as Yup from "yup";
import { Employee, Store } from "@prisma/client";

interface AssignEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  empDataMap: Map<string, Employee> | null;
  storeDataMap: Map<string, Store> | null;
}

const AssignEmployeeModal: React.FC<AssignEmployeeModalProps> = ({
  isOpen,
  onClose,
  storeDataMap,
  empDataMap,
}) => {
  const { toast } = useToast();
  const { sessionData, selectedStore } = useManagement();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      storeId: selectedStore?.storeId,
      empId: undefined,
      newStoreId: undefined,
    },
    validationSchema: Yup.object({
      empId: Yup.string().required("Select an employee to assign"),
      newStoreId: Yup.string().required("Select store to assign employee to"),
    }),
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
            <p>
              Re-assign an employee from{" "}
              <span className="font-bold text-gray-800">{`${selectedStore?.storeName}`}</span>
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div
            className={
              formik.values.empId
                ? "py-1 px-2 rounded-md bg-green-200 text-green-600"
                : "py-1 px-2 rounded-md bg-gray-200 text-gray-400"
            }
          >
            {formik.values.empId
              ? `${empDataMap?.get(formik.values.empId)?.empName}`
              : "Selected Employee"}
          </div>{" "}
          <ArrowRightIcon />{" "}
          <div
            className={
              formik.values.newStoreId
                ? "py-1 px-2 rounded-md bg-green-200 text-green-600"
                : "py-1 px-2 rounded-md bg-gray-200 text-gray-400"
            }
          >
            {formik.values.newStoreId
              ? `${storeDataMap?.get(formik.values.newStoreId)?.storeName}`
              : "Assigned to store"}
          </div>
        </div>
        <form onSubmit={formik.handleSubmit} className="py-4">
          <div className="flex gap-2">
            <div className="flex flex-col items-start gap-2 w-1/2">
              <Label htmlFor="empId" className="text-right">
                Employee
              </Label>
              {empDataMap ? (
                <Select
                  name="empId"
                  onValueChange={(value) =>
                    formik.setFieldValue("empId", value)
                  }
                  value={formik.values.empId || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/* Replace with actual employee options */}
                      {Array.from(empDataMap?.keys()).map((empId, index) => {
                        const emp = empDataMap.get(empId);
                        return (
                          <SelectItem value={empId} key={index}>
                            {emp?.empName}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <p className="bg-red-200 px-2 py-1 text-red-600">
                  No employees added yet
                </p>
              )}
              {formik.touched.empId && formik.errors.empId ? (
                <div className="text-red-500 col-span-4">
                  {formik.errors.empId}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col items-start gap-2 w-1/2">
              <Label htmlFor="newStoreId" className="text-right">
                Assign to Store
              </Label>
              {storeDataMap ? (
                <Select
                  name="newStoreId"
                  onValueChange={(value) =>
                    formik.setFieldValue("newStoreId", value)
                  }
                  value={formik.values.newStoreId || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Array.from(storeDataMap.keys()).map((storeId, index) => {
                        const store = storeDataMap.get(storeId);
                        return (
                          <SelectItem key={index} value={storeId}>
                            {store?.storeName}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <p className="bg-red-200 px-2 py-1 text-red-600">
                  No Stores added yet
                </p>
              )}
              {formik.touched.newStoreId && formik.errors.newStoreId ? (
                <div className="text-red-500 col-span-4">
                  {formik.errors.newStoreId}
                </div>
              ) : null}
            </div>
          </div>
          <DialogFooter className="mt-5">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Assigning..." : "Assign Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignEmployeeModal;
