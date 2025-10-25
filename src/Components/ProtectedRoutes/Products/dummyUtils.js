import * as Yup from "yup";

export const products = [
    { formLabelClass: "form-label", inputClass: "form-control", labelName : "HS Code:" , name: "hsCode", type: "number", placeholder: "HS Code (####.####)" },
    { formLabelClass: "form-label", inputClass: "form-control", labelName : "Product Description:" , name: "description", type: "text", placeholder: "Description" },
    { formLabelClass: "form-label", inputClass: "form-control", labelName : "Unit of Measure (UoM):" , name: "unit", type: "text", placeholder: "Unit (e.g., kg, pcs)" },
    
]

export const  initialValues ={
      hsCode: "",
      description: "",
      uom: "Numbers",
      taxType: "Goods at Standard Rates (Default)",
      qtyInHand: 0,
    }

    export const validationSchema = Yup.object({
        hsCode: Yup.string()
          .matches(/^\d{4}\.\d{4}$/, "HS Code must be in ####.#### format")
          .required("HS Code is required"),
        description: Yup.string()
          .max(60, "Description must be at most 60 characters")
          .required("Description is required"),
        uom: Yup.string().required("Unit of Measure is required"),
        taxType: Yup.string().required("Tax Type is required"),
        qtyInHand: Yup.number()
          .moreThan(0, "Quantity must be greater than 0")
          .required("Quantity is required"),
      });
    