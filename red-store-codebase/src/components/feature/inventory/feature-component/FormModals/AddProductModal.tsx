import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTypes: string[];
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  productTypes,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      brand: "",
      type: "",
      price: "",
      stock: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Product name is required"),
      brand: Yup.string().required("Brand is required"),
      type: Yup.string().required("Product type is required"),
      price: Yup.number().required("Price is required"),
      stock: Yup.number().required("Stock is required"),
    }),
    onSubmit: (values) => {
      setIsSubmitting(true);
      console.log("Form values:", values);
      setIsSubmitting(false);
      formik.resetForm();
      onClose();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new product to the inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="py-4">
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.name}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                type="text"
                value={formik.values.brand}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.brand && formik.errors.brand && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.brand}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="type">Product Type</Label>
              <Select
                name="type"
                onValueChange={(value) => formik.setFieldValue("type", value)}
                value={formik.values.type}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {productTypes.map((type, index) => (
                      <SelectItem key={index} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formik.touched.type && formik.errors.type && (
                <div className="text-red-500">{formik.errors.type}</div>
              )}
            </div>
            <div>
              <Label htmlFor="brand">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.price && formik.errors.price && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.price}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="brand">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formik.values.stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.stock && formik.errors.stock && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.stock}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="mt-5">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
