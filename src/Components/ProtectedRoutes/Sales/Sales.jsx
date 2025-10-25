import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { buyerInfo } from "./dummyUtils";
import SalesInvoice from "./SalesInvoice";
import { IoAddOutline } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx";
import { validationSchema, initialValues } from "./dummyUtils";
import Swal from "sweetalert2";
const TAX_RATE = 0.18;
const Sales = () => {
  const [storedData, setStoredData] = useState([]);
  const [storeProductDesc, setStoreProductDesc] = useState([]);
  const [retrieveValues, setRetriveValues] = useState(null);
  const [retrieveProductValues, setRetriveProductValues] = useState(null);
  const [getProductsData, setGetProductsData] = useState([]);
  const [editModeAndProductNameAndCustomerValue, setEditModeAndProductNameAndCustomerValue] = useState({ editMode: false, editProductName: false, customerValue: "" , customerType : ""});
  const [editIndex, setEditIndex] = useState(null);
  const [sellerInfoState, setSellerInfoState] = useState(null);
  const [date, setDate] = useState("");

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const beforeTax = values.productQty * values.productPrice;
      let afterTax = beforeTax + (beforeTax * TAX_RATE);
      if (retrieveValues?.customertype === "Un-Registered" && values.furtherTax) {
        values.furtherTax = Number(values.furtherTax)
        afterTax += (beforeTax * values.furtherTax / 100)
      }
      if (editModeAndProductNameAndCustomerValue.editMode && editIndex !== null) {
        const updated = [...getProductsData];
        const getRetrieveValues = { ...retrieveValues, ...values };
        const { hsCode, description, uom, taxType } = retrieveProductValues
        if (getRetrieveValues.customertype === "Registered") {
          getRetrieveValues.furtherTax = 0
        }
        const combineEditProductValues = {
          ...getRetrieveValues, hsCode, description, uom, taxType,
          productValueBeforeTax: beforeTax,
          productValueAfterTax: afterTax
        }
        const isProductHsCodeExisted = getProductsData.find((item) => ((item?.productValue === combineEditProductValues?.productValue) && (item?.hsCode === combineEditProductValues?.hsCode) && (editModeAndProductNameAndCustomerValue.editProductName)));

        const isProductValueSame = ((editModeAndProductNameAndCustomerValue.customerValue.productValue === combineEditProductValues.productValue) &&
          (editModeAndProductNameAndCustomerValue.editProductName));
        (isProductHsCodeExisted && !isProductValueSame) ?
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Product name and HSS code already existed!",
          })
          :
          updated[editIndex] = combineEditProductValues;
        setGetProductsData(updated);
        setEditModeAndProductNameAndCustomerValue((prev) => ({ ...prev, editMode: false }));
        setEditIndex(null);
      } else {
        const combineProductValue = {
          ...values,
          ...retrieveValues,
          productValueBeforeTax: beforeTax,
          productValueAfterTax: afterTax,
          ...retrieveProductValues
        };
        const isProductHsCodeExisted = getProductsData.find((item) => ((item.productValue === combineProductValue.productValue) && (item.hsCode === combineProductValue.hsCode)));
        isProductHsCodeExisted ?
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Product name and HSS code already existed!",
          })
          :
          setGetProductsData((prev) => [...prev, combineProductValue]);
      }
      localStorage.setItem("buyerInfo", JSON.stringify(retrieveValues))
      resetForm();
      setRetriveProductValues(null);
      setEditModeAndProductNameAndCustomerValue((prev) => ({ ...prev, editProductName: false }))
      // setRetriveValues(null);
    },
  });

  const handleEdit = (item, index) => {
    formik.setValues({
      customerValue: item.customerValue || "",
      productValue: item.productValue || "",
      productQty: item.productQty || "0",
      productPrice: item.productPrice || "0",
      furtherTax: item.furtherTax || "0",
    });
    setEditModeAndProductNameAndCustomerValue((prev) => ({ ...prev, editMode: true, customerValue: item }));
    setEditIndex(index);
    setRetriveProductValues(item);
  };

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("customers")) || [];
    const productData = JSON.parse(localStorage.getItem("products")) || [];
    const sellerValues = JSON.parse(localStorage.getItem("submitValues")) || [];
    const invoicesData = JSON.parse(localStorage.getItem("invoiceItems")) || [];
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    setStoredData(localData);
    setStoreProductDesc(productData);
    setSellerInfoState(sellerValues)
    setGetProductsData(invoicesData);
  }, []);

  useEffect(() => {
    localStorage.setItem("invoiceItems", JSON.stringify(getProductsData));
  }, [getProductsData]);
useEffect(()=>{
  const registeredCustomers = JSON.parse(localStorage.getItem("customers")) || [];
  const checkTaxType = registeredCustomers?.find((item)=>(item?.name && item?.customertype) !== (retrieveValues?.name && retrieveValues?.customertype ))
  console.log(checkTaxType , "cT")
  if(checkTaxType){
    setGetProductsData([])
  }
}, [retrieveValues?.customertype])
  return (
    <div className="container-fluid p-4 main-dashboard h-100">
      <h2 className="page-title mb-2">🧾 FBR Invoice Integration</h2>
      {/* Seller Info */}
      <div className="seller-buyer-wrapper">
        <div className="my-4">
          <div className="card px-4">
            <div className="d-flex justify-content-between">
              <h2 className="my-2">{"Seller Information"}</h2>
              <input type="date" className="w-25 border-2 rounded-pill px-4 mt-2 borderClass2" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="d-flex">
              <div>
                <p className="w-100 flex-1">
                  <strong>Business Name</strong>
                </p>
                <p className="w-100 flex-1">
                  <strong>NTN/CNIC</strong>
                </p>
                <p className="w-100 flex-1">
                  <strong>Address</strong>
                </p>
                <p className="w-100 flex-1">
                  <strong>Province</strong>
                </p>
              </div>
              <div>
                <p className="px-4"><strong>{sellerInfoState?.businessname}</strong></p>
                <p className="px-4"><strong>{sellerInfoState?.ntncninc}</strong></p>
                <p className="px-4"><strong>{sellerInfoState?.address}</strong></p>
                <p className="px-4"><strong>{sellerInfoState?.province}</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Buyer Info */}
        <div className="my-4">
          {buyerInfo.map((item, id) => (
            <div className="card px-4" key={id}>
              <h2 className="my-2">{item.heading}</h2>
              {item.type === "dropDown" && (
                <>
                  <div className="d-flex align-items-center">
                    <label className="form-label w-25 fw-bold">
                      {item.paragraphHeading}
                    </label>
                    <select
                      name="customerValue"
                      className="form-select p-2"
                      value={formik.values.customerValue || retrieveValues?.name}
                      onChange={(e) => {
                        formik.handleChange(e);
                        const findCustomer = storedData.find(
                          (c) => c.name === e.target.value
                        );
                        setRetriveValues(findCustomer || null);
                        formik.setFieldValue("customertype", findCustomer?.customertype || "");
                      }}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">Select Business Name</option>
                      {storedData.map((customer, index) => (
                        <option key={index} value={customer.name}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formik.touched.customerValue &&
                    formik.errors.customerValue && (
                      <div className="text-danger text-center">
                        {formik.errors.customerValue}
                      </div>
                    )}

                  {/* Customer details */}
                  <div className="d-flex align-items-center">
                    <div className="headingWidth">
                      <p><strong>NTN/CNIC</strong></p>
                      <p><strong>Address</strong></p>
                      <p><strong>Province</strong></p>
                      <p><strong>Customer Type</strong></p>
                    </div>
                    <div className="headingValues my-2">
                      {retrieveValues ? (
                        <>
                          <p><strong>{retrieveValues?.ntnCnic}</strong></p>
                          <p><strong>{retrieveValues?.address}</strong></p>
                          <p><strong>{retrieveValues?.province}</strong></p>
                          <p><strong>{retrieveValues?.customertype}</strong></p>
                        </>
                      ) : (
                        <>
                          <p><strong>--</strong></p>
                          <p><strong>--</strong></p>
                          <p><strong>--</strong></p>
                          <p><strong>--</strong></p>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Item Section */}
      <div className="my-4">
        <div className="card p-4">
          <h2>{editModeAndProductNameAndCustomerValue.editMode ? "Edit Item" : "Add Item"}</h2>
          <form onSubmit={formik.handleSubmit}>
            {/* Product Dropdown */}
            <div className="inputLabelData">
              <label className="w-25"><strong>Product Name</strong></label>
              <select
                name="productValue"
                className="form-select p-2"
                value={formik.values.productValue}
                onChange={(e) => {
                  formik.handleChange(e);
                  const findProduct = storeProductDesc.find(
                    (p) => p.description === e.target.value
                  );
                  setRetriveProductValues(findProduct || null);
                  setEditModeAndProductNameAndCustomerValue((prev) => ({ ...prev, editProductName: true }))

                }}
                onBlur={formik.handleBlur}
              >
                <option value="">Select Product Description</option>
                {storeProductDesc.map((product, index) => (
                  <option key={index} value={product.description}>
                    {product.description}
                  </option>
                ))}
              </select>
            </div>
            {formik.touched.productValue && formik.errors.productValue && (
              <div className="text-danger text-center">
                {formik.errors.productValue}
              </div>
            )}

            <div className="d-flex">
              <div className="headingWidth">
                <p className="m-0 py-2"><strong>HSS Code</strong></p>
                <p className="m-0 py-2"><strong>UOM</strong></p>
                <p className="m-0 py-2"><strong>Tax Type</strong></p>
              </div>
              <div>
                {retrieveProductValues ? (
                  <>
                    <p className="m-0 py-2"><strong>{retrieveProductValues?.hsCode}</strong></p>
                    <p className="m-0 py-2"><strong>{retrieveProductValues?.uom}</strong></p>
                    <p className="m-0 py-2"><strong>{retrieveProductValues?.taxType}</strong></p>
                  </>
                ) : (
                  <>
                    <p className="m-0 py-2"><strong>--</strong></p>
                    <p className="m-0 py-2"><strong>--</strong></p>
                    <p className="m-0 py-2"><strong>--</strong></p>
                  </>
                )}
              </div>
            </div>

            <div className="inputLabelData">
              <label className="w-25"><strong>Quantity</strong></label>
              <input
                type="number"
                name="productQty"
                className="form-control my-2"
                value={formik.values.productQty}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.productQty && formik.errors.productQty && (
              <div className="text-danger text-center">
                {formik.errors.productQty}
              </div>
            )}

            <div className="inputLabelData">
              <label className="w-25"><strong>Price</strong></label>
              <input
                type="number"
                name="productPrice"
                className="form-control my-2"
                value={formik.values.productPrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.productPrice && formik.errors.productPrice && (
              <div className="text-danger text-center">
                {formik.errors.productPrice}
              </div>
            )}

            <div className="inputLabelData">
              <label className="w-25"><strong>Sales Tax</strong></label>
              <input
                className="form-control my-2"
                type="text"
                value="18%"
                readOnly
              />
            </div>

            {retrieveValues?.customertype === "Un-Registered" && (
              <>
                <div className="inputLabelData">
                  <label className="w-25"><strong>Further Tax</strong></label>
                  <input
                    className="form-control my-2"
                    type="text"
                    name="furtherTax"
                    value={formik.values.furtherTax !== "" ? `${formik.values.furtherTax}%` : "0%"}
                    onChange={(e) => {
                      const cleanValue = e.target.value.replace("%", "");
                      if (!isNaN(cleanValue)) {
                        formik.setFieldValue("furtherTax", cleanValue);
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.furtherTax && formik.errors.furtherTax && (
                  <div className="text-danger text-center">
                    {formik.errors.furtherTax}
                  </div>
                )}
              </>
            )}

            <div className="inputLabelData">
              <label className="w-25"><strong>Value (Ex-Sales Tax)</strong></label>
              <input
                className="form-control my-2"
                type="number"
                value={
                  formik.values.productQty && formik.values.productPrice
                    ? formik.values.productQty * formik.values.productPrice
                    : 0
                }
                readOnly
              />
            </div>

            <div className="inputLabelData">
              <label className="w-25"><strong>Value (Sales Tax)</strong></label>
              <input
                className="form-control my-2"
                type="number"
                value={
                  formik.values.productQty && formik.values.productPrice
                    ? (
                      formik.values.productQty *
                      formik.values.productPrice *
                      (1 + TAX_RATE) +
                      (retrieveValues?.customertype === "Un-Registered"
                        ? (formik.values.productQty * formik.values.productPrice * formik.values.furtherTax) / 100
                        : 0)
                    ).toFixed(2)
                    : 0
                }
                readOnly
              />
            </div>

            {editModeAndProductNameAndCustomerValue.editMode ? (
              <button type="submit" className="btn btn-success">
                <RxUpdate className="fs-4" /> Update Item
              </button>
            ) : (
              <button type="submit" className="btn btn-primary">
                <IoAddOutline className="fs-4" /> Add Item
              </button>
            )}

          </form>
        </div>
        {getProductsData?.length > 0 && (
          <SalesInvoice
            getProductsData={getProductsData}
            setGetProductsData={setGetProductsData}
            onEdit={handleEdit}
            date={date}
            sellerInfoState={sellerInfoState}
            editMode={editModeAndProductNameAndCustomerValue.editMode}
          />
        )}
      </div>
    </div>
  );
};

export default Sales;
