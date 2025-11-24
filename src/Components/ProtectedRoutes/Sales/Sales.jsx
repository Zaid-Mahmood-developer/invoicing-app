import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import SalesInvoice from "./SalesInvoice";
import { IoAddOutline } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx";
import { validationSchema, initialValues, buyerInfo, scenarioId } from "./dummyUtils";
import Swal from "sweetalert2";
import { useGetApi } from "../../../customhooks/useGetApi";
import Spinner from "../../utils/Spinner/Spinner";
const Sales = () => {
  const getSellerUrl = `${import.meta.env.VITE_API_URL}seller/details`;
  const getAllCustomers = `${import.meta.env.VITE_API_URL}customer`;
  const getAllProducts = `${import.meta.env.VITE_API_URL}products`;

  const [retrieveValues, setRetriveValues] = useState(null);
  const [retrieveProductValues, setRetriveProductValues] = useState(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState("");

  const [getProductsData, setGetProductsData] = useState([]);
  const [editModeAndProductNameAndCustomerValue, setEditModeAndProductNameAndCustomerValue] = useState({ editMode: false, editProductName: false, customerValue: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [date, setDate] = useState("");
  const { data: sellerData, loading, error, fetchData: fetchSeller } = useGetApi(getSellerUrl, true);
  const { data: allCustomers, fetchData: fetchAllCustomers } = useGetApi(null, false);
  const { data: allProducts, fetchData: fetchAllProducts } = useGetApi(null, false);

  const [sellerInfo, setSellerInfo] = useState(null);
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const beforeTax = values.productQty * values.productPrice;

      let afterTax = beforeTax + (beforeTax * (retrieveProductValues?.taxType?.salesTaxValue / 100));
      if (retrieveValues?.customertype === "Unregistered" && values.furtherTax) {
        values.furtherTax = Number(values.furtherTax)
        afterTax += (beforeTax * (values.furtherTax / 100))
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

      resetForm();
      setRetriveProductValues(null);
      setEditModeAndProductNameAndCustomerValue((prev) => ({ ...prev, editProductName: false }))
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
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);


  useEffect(() => {
    const checkTaxType = getProductsData?.find((item) => (item?.customertype) !== retrieveValues.customertype)
    if (checkTaxType) {
      Swal.fire({
        title: "Customer Type Changed",
        text: "Changing customer type will clear the cart. Continue?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, clear it",
      }).then((result) => {
        if (result.isConfirmed) {
          setGetProductsData([]);
        }
      });
    }
  }, [retrieveValues?.customertype])

  useEffect(() => {
    if (sellerData?.status) {
      setSellerInfo(sellerData?.data)
    } else if (error) {
      Swal.fire({
        icon: "error",
        text: error?.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#dc3545",
      });
    }
  }, [sellerData, error])
  return (
    <>
      {
        loading ?
          <Spinner />
          :
          <div className="container-fluid p-4 main-dashboard h-100" style={{ background: "linear-gradient(135deg, #0A5275 0%, #0b0b0b 100%)", }}>
            <h2 className="page-title mb-2" style={{ color: "#E0E7E9" }}>🧾 FBR Invoice Integration</h2>
            {/* Seller Info */}
            <div className="seller-buyer-wrapper">
              <div className="my-4">
                <div className="card px-4" style={{
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(6px)",
                  borderRadius: "15px", boxShadow: "0 6px 15px rgba(0,0,0,0.2)"
                }}>
                  <div className="d-flex justify-content-between">
                    <h2 className="my-2" style={{ color: "#0A5275" }}>{"Seller Information"}</h2>
                    <input
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      className="w-25 rounded-pill px-4 mt-2"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      style={{ borderColor: "#0A5275", backgroundColor: "#E0E7E9", color: "#0A5275" }}
                    />
                  </div>
                  <div className="d-flex">
                    <div className="headingWidth" style={{color: "#0A5275"}}>
                      <p><strong>Business Name</strong></p>
                      <p><strong>NTN/CNIC</strong></p>
                      <p><strong>Address</strong></p>
                      <p><strong>Province</strong></p>
                    </div>
                    <div style={{color: "#0A5275"}}>
                      <p><strong>{sellerInfo?.BusinessName}</strong></p>
                      <p><strong>{sellerInfo?.NTNCNIC}</strong></p>
                      <p><strong>{sellerInfo?.Address}</strong></p>
                      <p><strong>{sellerInfo?.Province}</strong></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="my-4">
                {buyerInfo.map((item, id) => (
                  <div
                    className="card px-4"
                    key={id}
                    style={{
                      background: "rgba(255,255,255,0.88)",
                      backdropFilter: "blur(6px)", borderRadius: "15px", boxShadow: "0 6px 15px rgba(0,0,0,0.2)", color: "#0A5275", marginBottom: "15px"
                    }}
                  >
                    <h2 className="my-2" style={{ color: "#0A5275" }}>{item.heading}</h2>
                    {item.type === "dropDown" && (
                      <>
                        <div className="d-flex align-items-center" style={{ marginBottom: "10px" }}>
                          <label className="form-label w-25 fw-bold" style={{ color: "#0A5275" }}>{item.paragraphHeading}</label>
                          <select
                            name="customerValue"
                            className="form-select p-2"
                            value={formik.values.customerValue || retrieveValues?.name}
                            onClick={() => fetchAllCustomers(getAllCustomers)}
                            onChange={(e) => {
                              formik.handleChange(e);
                              const name = e.target.value;
                              if (name && allCustomers?.data) {
                                const selected = allCustomers.data.find(c => c.name === name);
                                setRetriveValues(selected || null);
                                formik.setFieldValue("customertype", selected?.customertype || "");
                              } else {
                                setRetriveValues(null);
                              }
                            }}
                            style={{
                              borderColor: "#0A5275", backgroundColor: "#d9edf2", 
                              backdropFilter: "blur(6px)", color: "#0A5275"
                            }}
                          >
                            <option value="">Select Business Name</option>
                            {allCustomers?.data?.map((customer, index) => (
                              <option key={index} value={customer.name}>{customer.name}</option>
                            ))}
                          </select>
                        </div>
                        {formik.touched.customerValue && formik.errors.customerValue && (
                          <div style={{ color: "red", textAlign: "center" }}>{formik.errors.customerValue}</div>
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

                        {/* Scenario ID */}
                        {scenarioId.map((item, idx) => (
                          <React.Fragment key={idx}>
                            <div className="d-flex align-items-center pb-1">
                              {item.type === "dropDown" && (
                                <>
                                  <label className="form-label w-25 fw-bold" style={{ color: "#0A5275" }}>{item.paragraphHeading}</label>
                                  <select
                                    name="scenarioId"
                                    className="form-select p-2"
                                    value={formik.values.scenarioId}
                                    onChange={(e) => {
                                      formik.handleChange(e);
                                      setSelectedScenarioId(e.target.value);
                                    }}
                                    onBlur={formik.handleBlur}
                                    style={{ borderColor: "#0A5275",  backgroundColor: "#d9edf2",
                              backdropFilter: "blur(6px)",color: "#0A5275" }}
                                  >
                                    <option value="">Select Scenario Id</option>
                                    {item.paragraphDetail.map((sid, i) => (
                                      <option key={i} value={sid}>{sid}</option>
                                    ))}
                                  </select>
                                </>
                              )}
                            </div>

                            {item.type === "dropDown" && (
                              <div className="ms-25" style={{ marginLeft: "25%" }}>
                                {formik.touched.scenarioId && formik.errors.scenarioId && (
                                  <div style={{ color: "red", fontSize: "14px", marginBottom: "5px" }}>{formik.errors.scenarioId}</div>
                                )}
                                <div style={{ color: "red", fontSize: "13px" }}>
                                  Please select the scenario id according to your sale type and customer type
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add/Edit Item Section */}
            <div className="my-4">
              <div
                className="card p-4"
                style={{
                background: "rgba(255,255,255,0.88)",
                      backdropFilter: "blur(6px)",
                  borderRadius: "15px",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                  color: "#0A5275",
                }}
              >
                <h2 style={{ color: "#0A5275" }}>
                  {editModeAndProductNameAndCustomerValue.editMode ? "Edit Item" : "Add Item"}
                </h2>
                <form onSubmit={formik.handleSubmit}>
                  {/* Product Dropdown */}
                  <div className="inputLabelData" style={{ marginBottom: "10px" }}>
                    <label className="w-25" style={{ fontWeight: "600" }}>Product Name</label>
                    <select
                      name="productValue"
                      className="form-select p-2"
                      value={formik.values.productValue}
                      onClick={() => fetchAllProducts(getAllProducts)}
                      onChange={(e) => {
                        formik.handleChange(e);
                        const productdescription = e.target.value;
                        if (productdescription && allProducts?.products) {
                          const selected = allProducts?.products.find(
                            (proDesc) => proDesc.description === productdescription
                          );
                          setRetriveProductValues(selected || null);
                        } else {
                          setRetriveProductValues(null);
                        }
                        setEditModeAndProductNameAndCustomerValue((prev) => ({
                          ...prev,
                          editProductName: true,
                        }));
                      }}
                      onBlur={formik.handleBlur}
                      style={{ borderColor: "#0A5275", backgroundColor: "#d9edf2", color: "#0A5275" }}
                    >
                      <option value="">Select Product Description</option>
                      {allProducts?.products?.map((product, index) => (
                        <option key={index} value={product.description}>
                          {product.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formik.touched.productValue && formik.errors.productValue && (
                    <div style={{ color: "red", textAlign: "center" }}>{formik.errors.productValue}</div>
                  )}

                  {/* HS Code, UOM, Tax Type */}
                  <div className="d-flex">
                    <div className="headingWidth">
                      <p className="m-0 py-2"><strong>HS Code</strong></p>
                      <p className="m-0 py-2"><strong>UOM</strong></p>
                      <p className="m-0 py-2"><strong>Tax Type</strong></p>
                    </div>
                    <div>
                      {retrieveProductValues ? (
                        <>
                          <p className="m-0 py-2"><strong>{retrieveProductValues?.hsCode}</strong></p>
                          <p className="m-0 py-2"><strong>{retrieveProductValues?.uom}</strong></p>
                          <p className="m-0 py-2"><strong>{retrieveProductValues?.taxType?.descriptionType}</strong></p>
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

                  {/* Quantity */}
                  <div className="inputLabelData" style={{ marginBottom: "10px" }}>
                    <label className="w-25" style={{ fontWeight: "600" }}>Quantity</label>
                    <input
                      type="number"
                      name="productQty"
                      className="form-control my-2"
                      value={formik.values.productQty}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      style={{ borderColor: "#0A5275", backgroundColor: "#d9edf2", color: "#0A5275" }}
                    />
                  </div>
                  {formik.touched.productQty && formik.errors.productQty && (
                    <div style={{ color: "red", textAlign: "center" }}>{formik.errors.productQty}</div>
                  )}

                  {/* Price */}
                  <div className="inputLabelData" style={{ marginBottom: "10px" }}>
                    <label className="w-25" style={{ fontWeight: "600" }}>Price</label>
                    <input
                      type="number"
                      name="productPrice"
                      className="form-control my-2"
                      value={formik.values.productPrice}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      style={{ borderColor: "#0A5275", backgroundColor: "#d9edf2", color: "#0A5275" }}
                    />
                  </div>
                  {formik.touched.productPrice && formik.errors.productPrice && (
                    <div style={{ color: "red", textAlign: "center" }}>{formik.errors.productPrice}</div>
                  )}

                  {/* Sales Tax */}
                  <div className="inputLabelData" style={{ marginBottom: "10px" }}>
                    <label className="w-25" style={{ fontWeight: "600" }}>Sales Tax</label>
                    <input
                      className="form-control my-2"
                      type="text"
                      value={retrieveProductValues?.taxType?.salesTaxValue ? `${retrieveProductValues?.taxType?.salesTaxValue}%` : "0%"}
                      readOnly
                      style={{ borderColor: "#0A5275", backgroundColor: "#d9edf2", color: "#0A5275" }}
                    />
                  </div>

                  {/* Further Tax for Unregistered Customers */}
                  {retrieveValues?.customertype === "Unregistered" && (
                    <div className="inputLabelData" style={{ marginBottom: "10px" }}>
                      <label className="w-25" style={{ fontWeight: "600" }}>Further Tax</label>
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
                        style={{ borderColor: "#0A5275", backgroundColor: "#d9edf2", color: "#0A5275" }}
                      />
                      {formik.touched.furtherTax && formik.errors.furtherTax && (
                        <div style={{ color: "red", textAlign: "center" }}>{formik.errors.furtherTax}</div>
                      )}
                    </div>
                  )}

                  {/* Value Ex-Sales Tax */}
                  <div className="inputLabelData" style={{ marginBottom: "10px" }}>
                    <label className="w-25" style={{ fontWeight: "600" }}>Value (Ex-Sales Tax)</label>
                    <input
                      className="form-control my-2"
                      type="number"
                      value={
                        formik.values.productQty && formik.values.productPrice
                          ? formik.values.productQty * formik.values.productPrice
                          : 0
                      }
                      readOnly
                      style={{ borderColor: "#0A5275", backgroundColor: "#d9edf2", color: "#0A5275" }}
                    />
                  </div>

                  {/* Value Sales Tax */}
                  <div className="inputLabelData" style={{ marginBottom: "10px" }}>
                    <label className="w-25" style={{ fontWeight: "600" }}>Value (Sales Tax)</label>
                    <input
                      className="form-control my-2"
                      type="number"
                      value={
                        formik.values.productQty && formik.values.productPrice
                          ? (
                            (Number(formik.values.productPrice * formik.values.productQty) *
                              (Number(retrieveProductValues?.taxType?.salesTaxValue / 100))) +
                            (formik.values.productPrice * formik.values.productQty) +
                            (retrieveValues?.customertype === "Unregistered"
                              ? Number(formik.values?.furtherTax / 100) * (formik.values.productPrice * formik.values.productQty)
                              : 0)
                          ).toFixed(2)
                          : 0
                      }
                      readOnly
                      style={{ borderColor: "#0A5275", backgroundColor: "#d9edf2", color: "#0A5275" }}
                    />
                  </div>

                  {/* Add / Update Button */}
                  {editModeAndProductNameAndCustomerValue.editMode ? (
                    <button
                      type="submit"
                      className="btn"
                      style={{
                        backgroundColor: "#0A5275",
                        color: "#fff",
                        borderRadius: "8px",
                        padding: "8px 20px",
                        marginTop: "10px",
                      }}
                    >
                      <RxUpdate className="fs-4" /> Update Item
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn"
                      style={{
                        backgroundColor: "#0A5275",
                        color: "#fff",
                        borderRadius: "8px",
                        padding: "8px 20px",
                        marginTop: "10px",
                      }}
                    >
                      <IoAddOutline className="fs-4" /> Add Item
                    </button>
                  )}
                </form>
              </div>
              {getProductsData?.length > 0 && (<SalesInvoice getProductsData={getProductsData} setGetProductsData={setGetProductsData} onEdit={handleEdit} date={date} signupValues={sellerInfo} editMode={editModeAndProductNameAndCustomerValue.editMode} buyerValues={retrieveValues} selectedScenarioId={selectedScenarioId} />)}
            </div>

          </div>
      }
    </>
  );
};

export default Sales;
