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
import { useInventory } from "@/app/contexts/inventory/InventoryContext";
import { Inventory } from "@prisma/client";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTypes: string[];
  amountMeasurements: string[];
  productCategories: string[];
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  productTypes,
  amountMeasurements,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sessionData, selectedStore } = useInventory();

  const formik = useFormik({
    initialValues: {
      invItem: "",
      invItemBrand: "",
      invItemType: "",
      invItemPrice: "",
      invItemStock: "",
      invItemBarcode: "",
      invItemSize: "",
      category: "",
      amount: "",
      measurement: "",
    },
    validationSchema: Yup.object({
      invItem: Yup.string().required("Product name is required"),
      invItemBrand: Yup.string().required("Brand is required"),
      invItemType: Yup.string().required("Product type is required"),
      invItemPrice: Yup.number().required("Price is required"),
      invItemStock: Yup.number().required("Stock is required"),
      invItemBarcode: Yup.number().nullable(),
      invItemSize: Yup.number().nullable(),
      category: Yup.string().required("Category is required"),
      amount: Yup.string().required("Bottle Amount is required"),
      measurement: Yup.string().required("Measurement is required"),
    }),
    onSubmit: (values) => {
      setIsSubmitting(true);
      const newProduct: Partial<Inventory> = {
        storeId: selectedStore?.storeId,
        storeManagerId: sessionData?.id,
        invItem: values.invItem,
        invItemBrand: values.invItemBrand,
        invItemStock: Number(values.invItemStock),
        invItemPrice: Number(values.invItemPrice),
        invItemType: values.invItemType,
        invCreatedDate: new Date(),
        invItemBarcode: values.invItemBarcode
          ? Number(values.invItemBarcode)
          : null,
        invItemSize: values.invItemSize ? Number(values.invItemSize) : null,
        invAdditional: {
          category: values.category,
          size: values.amount,
          measurement: values.measurement,
        },
      };
      console.log("New Product:", newProduct);
      setIsSubmitting(false);
      formik.resetForm();
      onClose();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new product to the inventory.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={formik.handleSubmit}
          className="py-4 grid grid-cols-2 gap-4"
        >
          <div className="col-span-1">
            <Label htmlFor="invItem">Product Name</Label>
            <Input
              id="invItem"
              name="invItem"
              type="text"
              value={formik.values.invItem}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.invItem && formik.errors.invItem && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.invItem}
              </div>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="invItemBrand">Brand</Label>
            <Input
              id="invItemBrand"
              name="invItemBrand"
              type="text"
              value={formik.values.invItemBrand}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.invItemBrand && formik.errors.invItemBrand && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.invItemBrand}
              </div>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="invItemType">Product Type</Label>
            <Select
              name="invItemType"
              onValueChange={(value) =>
                formik.setFieldValue("invItemType", value)
              }
              value={formik.values.invItemType}
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
            {formik.touched.invItemType && formik.errors.invItemType && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.invItemType}
              </div>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="invItemPrice">Price</Label>
            <Input
              id="invItemPrice"
              name="invItemPrice"
              type="number"
              value={formik.values.invItemPrice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.invItemPrice && formik.errors.invItemPrice && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.invItemPrice}
              </div>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="invItemStock">Stock</Label>
            <Input
              id="invItemStock"
              name="invItemStock"
              type="number"
              value={formik.values.invItemStock}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.invItemStock && formik.errors.invItemStock && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.invItemStock}
              </div>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="invItemBarcode">Barcode</Label>
            <Input
              id="invItemBarcode"
              name="invItemBarcode"
              type="number"
              value={formik.values.invItemBarcode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="col-span-1">
            <Label htmlFor="invItemSize">Item Size</Label>
            <Input
              id="invItemSize"
              name="invItemSize"
              type="number"
              value={formik.values.invItemSize}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="col-span-1">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              type="text"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.category && formik.errors.category && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.category}
              </div>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="size">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="text"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.amount && formik.errors.amount && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.amount}
              </div>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="measurement">Measurement</Label>
            <Input
              id="measurement"
              name="measurement"
              type="text"
              value={formik.values.measurement}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.measurement && formik.errors.measurement && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.measurement}
              </div>
            )}
          </div>
          <DialogFooter className="col-span-2 mt-5">
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
