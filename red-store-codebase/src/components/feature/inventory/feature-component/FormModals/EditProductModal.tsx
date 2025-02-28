/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
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
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { AddProductFormValidation } from "@/lib/formik/formik";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTypes: string[];
  product: Inventory; // Existing product to be edited
}

interface StoreDefinition {
  fieldName: string;
  label: string;
  type: string;
  allowedValues?: string[];
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  productTypes,
  product,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<{ [key: string]: any }>(
    {}
  );
  const { selectedStore, handleRefresh } = useInventory();

  const customFields =
    (selectedStore?.customfields as unknown as StoreDefinition[]) || [];

  useEffect(() => {
    const baseInitialValues = {
      invItem: product.invItem || "",
      invItemBrand: product.invItemBrand || "",
      invItemType: product.invItemType || "",
      invItemPrice: String(product.invItemPrice) || "",
      invItemStock: String(product.invItemStock) || "",
      invItemBarcode: product.invItemBarcode || "",
    };

    const dynamicInitialValues = customFields.reduce(
      (acc: { [key: string]: string }, field) => {
        acc[field.fieldName] = product.invAdditional?.[field.fieldName] || "";
        return acc;
      },
      { ...baseInitialValues }
    );

    setInitialValues(dynamicInitialValues);
  }, [customFields, product]);

  const formik = useFormik({
    initialValues,
    validationSchema: AddProductFormValidation,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);

        const invAdditional = customFields.reduce(
          (acc: { [key: string]: string }, field) => {
            acc[field.fieldName] = values[field.fieldName];
            return acc;
          },
          {}
        );

        const updatedProduct: Partial<Inventory> = {
          invItem: values.invItem,
          invItemBrand: values.invItemBrand,
          invItemStock: Number(values.invItemStock),
          invItemPrice: Number(values.invItemPrice),
          invItemType: values.invItemType,
          invItemBarcode: values.invItemBarcode,
          invAdditional,
        };

      const requestBody = {
        storeId: selectedStore?.storeId,
        updates: updatedProduct,
      };

      console.log("Sending request to API:", requestBody);

      await axios.put(`/api/inventory/products/${product.invId}`, requestBody);


        toast({
          title: "Success",
          description: "Product updated successfully",
          variant: "default",
        });

        onClose();
        handleRefresh();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update product. Please try again.",
          variant: "destructive",
        });
        console.error("Error updating product:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Modify the product details and save.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={formik.handleSubmit}
          className="py-4 grid grid-cols-2 gap-4"
        >
          {Object.keys(initialValues).map((field) => (
            <div key={field} className="col-span-1">
              <Label htmlFor={field}>
                {field.replace("invItem", "").toUpperCase()}
              </Label>
              <Input
                id={field}
                name={field}
                type="text"
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          ))}

          <DialogFooter className="col-span-2 mt-5">
            <Button type="submit" variant="secondary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
