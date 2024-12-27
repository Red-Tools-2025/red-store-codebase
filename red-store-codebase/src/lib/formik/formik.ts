import * as Yup from "yup";

export const AddProductFormValidation = Yup.object({
  invItem: Yup.string().required("Product name is required"),
  invItemBrand: Yup.string().required("Brand is required"),
  invItemType: Yup.string().required("Product type is required"),
  invItemPrice: Yup.number().required("Price is required"),
  invItemStock: Yup.number().required("Stock is required"),
  invItemBarcode: Yup.string().nullable(),
  invItemSize: Yup.number().nullable(),
  category: Yup.string().required("Category is required"),
  amount: Yup.string().required("Bottle Amount is required"),
  measurement: Yup.string().required("Measurement is required"),
});

export const DefineStoreFormValidation = Yup.object({
  fieldName: Yup.string().required("Field name is required"),
  label: Yup.string().required("Label is required"),
  type: Yup.string().required("Field type is required"),
});

export const DefineStoreFormValidationSelect = Yup.object({
  fieldName: Yup.string().required("Field name is required"),
  label: Yup.string().required("Label is required"),
  type: Yup.string().required("Field type is required"),
  allowedValues: Yup.array()
    .of(Yup.string())
    .required("Allowed values are required for select type"),
});
