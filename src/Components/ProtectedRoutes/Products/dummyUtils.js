import * as Yup from "yup";

export const products = [
  { formLabelClass: "form-label", inputClass: "form-control", labelName: "HS Code:", name: "hsCode", type: "text", placeholder: "HS Code (####.####)" },
  { formLabelClass: "form-label", inputClass: "form-control", labelName: "Product Description:", name: "description", type: "text", placeholder: "Description" },
  { formLabelClass: "form-label", inputClass: "form-control", labelName: "Unit of Measure (UoM):", name: "uom", type: "dropdownUnit", placeholder: "Unit (e.g., Numbers , kg, pcs , PKTs)", options: ["Numbers", "KG", "pieces", "PKTs"] },
  {
    formLabelClass: "form-label", inputClass: "form-control", labelName: "Tax Type", name: "taxType", type: "text", placeholder: "Enter tax type", type: "dropdown",
    //  options: [
    //   { ScenarioId: "SN001", descriptionType: "Goods at standard rate (default)", salesTaxValue: 18 },
    //   { ScenarioId: "SN002", descriptionType: "Goods at standard rate (default)", salesTaxValue: 18 },
    //   { ScenarioId: "SN005", descriptionType: "Reduced Rate Sale", salesTaxValue: 5 },
    //   { ScenarioId: "SN006", descriptionType: "Exempt goods sale", salesTaxValue: 0 },
    //   { ScenarioId: "SN007", descriptionType: "Zero rated sale", salesTaxValue: 0 },
    //   { ScenarioId: "SN008", descriptionType: "Rate for 3rd schedule goods", salesTaxValue: 18 },
    //   { ScenarioId: "SN019", descriptionType: "Sale for services", salesTaxValue: 16 },
    //   { ScenarioId: "SN026", descriptionType: "Sale to end consumer by retailers (Goods at standard rate)", salesTaxValue: 18 },
    //   { ScenarioId: "SN027", descriptionType: "Sale to end consumer by retailers (3rd schedule goods)", salesTaxValue: 18 },
    //   { ScenarioId: "SN028", descriptionType: "Sale to end consumer by retailers (Goods at reduced rate)", salesTaxValue: 5 }
    // ]
    options: [
      {  descriptionType: "Goods at standard rate (default)", salesTaxValue: 18 },
      {  descriptionType: "Goods at standard rate (default)", salesTaxValue: 18 },
      {  descriptionType: "Reduced Rate Sale", salesTaxValue: 5 },
      { descriptionType: "Exempt goods sale", salesTaxValue: 0 },
      {  descriptionType: "Zero rated sale", salesTaxValue: 0 },
      {  descriptionType: "Rate for 3rd schedule goods", salesTaxValue: 18 },
      {  descriptionType: "Sale for services", salesTaxValue: 16 },
      {  descriptionType: "Sale to end consumer by retailers (Goods at standard rate)", salesTaxValue: 18 },
      {  descriptionType: "Sale to end consumer by retailers (3rd schedule goods)", salesTaxValue: 18 },
      {  descriptionType: "Sale to end consumer by retailers (Goods at reduced rate)", salesTaxValue: 5 }
    ]
  },
  { formLabelClass: "form-label", inputClass: "form-control", labelName: "Quantity On Hand:", name: "qtyInHand", type: "number", placeholder: "HS Code (####.####)" },
]

export const initialValues = {
  hsCode: "",
  description: "",
  uom: "Select UOM",
  // taxType: { descriptionType: "", ScenarioId: "" , salesTaxValue : "" },
  taxType: { descriptionType: "" , salesTaxValue : "" },

  qtyInHand: 0,
}

export const validationSchema = Yup.object({
  hsCode: Yup.string()
    .matches(/^\d{4}\.\d{4}$/, "HS Code must be in ####.#### format")
    .required("HS Code is required"),
  description: Yup.string()
    .max(60, "Description must be at most 60 characters")
    .required("Description is required"),
  uom: Yup.string()
    .test(
      "not-default",
      "Please select uom",
      (value) =>
        value !== "Select UOM" && value !== "" && value !== undefined
    )
    .required("Uom is required"),
  taxType: Yup.object({
    descriptionType: Yup.string().required("Please select tax type"),
    // ScenarioId: Yup.string().required(),
    salesTaxValue : Yup.string().required()
  })
    .required("Tax type is required"),
  qtyInHand: Yup.number()
    .moreThan(0, "Quantity must be greater than 0")
    .required("Quantity is required"),
});
