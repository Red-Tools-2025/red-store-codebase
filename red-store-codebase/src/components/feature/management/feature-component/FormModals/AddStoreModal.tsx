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
import { useFormik } from "formik";
import * as Yup from "yup";

interface AddStoreModalProps {
  isOpen: boolean; // Whether the dialog is open
  onClose: () => void; // Function to close the modal
  // onStoreAdded: () => void; // Callback to refresh store data
}

const AddStoreModal: React.FC<AddStoreModalProps> = ({
  isOpen,
  onClose,
  // onStoreAdded,
}) => {
  const { sessionData } = useManagement();
  const formik = useFormik({
    initialValues: {
      storeName: "",
      storeLocation: "",
      storeManagerId: sessionData?.id,
      storeStatus: true, // Default status
    },
    validationSchema: Yup.object({
      storeName: Yup.string().required("Store name is required"),
      storeLocation: Yup.string().required("Store location is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch("/api/management/stores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Failed to add store");
        }

        await response.json();
        // onStoreAdded(); // Refresh store data
        formik.resetForm(); // Reset the form after submission
        onClose(); // Close the modal after submission
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Store</DialogTitle>
          <DialogDescription>
            Fill in the details of the new store.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="grid gap-4 py-4">
          <div className="flex-col">
            <Label htmlFor="storeName" className="text-right">
              Store Name
            </Label>
            <Input
              id="storeName"
              name="storeName"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.storeName}
              onBlur={formik.handleBlur}
              className="col-span-3"
            />
            {formik.touched.storeName && formik.errors.storeName ? (
              <div className="text-red-500 col-span-4">
                {formik.errors.storeName}
              </div>
            ) : null}
          </div>
          <div className="flex-col">
            <Label htmlFor="storeLocation" className="text-right">
              Store Location
            </Label>
            <Input
              id="storeLocation"
              name="storeLocation"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.storeLocation}
              onBlur={formik.handleBlur}
              className="col-span-3"
            />
            {formik.touched.storeLocation && formik.errors.storeLocation ? (
              <div className="text-red-500 col-span-4">
                {formik.errors.storeLocation}
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button type="submit">Add Store</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStoreModal;
