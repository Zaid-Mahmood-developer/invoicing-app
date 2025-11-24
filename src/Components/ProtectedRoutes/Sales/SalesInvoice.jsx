import { MdModeEdit, MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";
import { usePostApi } from "../../../customhooks/usePostApi";
import { usePostFbr } from "../../../customhooks/usePostFbr";
import Spinner from "../../utils/Spinner/Spinner";
import Swal from "sweetalert2";

const SalesInvoice = ({ getProductsData, setGetProductsData, onEdit, date, signupValues, buyerValues, selectedScenarioId }) => {

  let signupValuesNtnCnic = signupValues?.NTNCNIC?.toString();

  const postFbrApiUrl = import.meta.env.VITE_API_URL_FBR_SALES_URL;
  const postLocalApiUrl = `${import.meta.env.VITE_API_URL}saleinvoice`;

  const { registerUser: postFbrInvoice, data, loading, error } = usePostFbr(postFbrApiUrl);
  const { registerUser: postLocalInvoice } = usePostApi(postLocalApiUrl);

  const [grandTotal, setGrandTotal] = useState(0);
  const [submitInvoiceData, setSubmitInvoiceData] = useState(null);

  const delInvoiceItem = (id) => {
    const delInvoiceItem = getProductsData.filter((_, index) => index !== id);
    setGetProductsData(delInvoiceItem);
  };

  const editInvoiceItem = (id) => {
    const findInvoiceItem = getProductsData.find((_, index) => index === id);
    onEdit(findInvoiceItem, id);
  };

  const submitInvoice = async () => {
    await postFbrInvoice(
      {
        invoiceType: "Sale Invoice",
        invoiceDate: date,
        sellerNTNCNIC: signupValuesNtnCnic,
        sellerBusinessName: signupValues?.BusinessName,
        sellerProvince: signupValues?.Province,
        sellerAddress: signupValues?.Address,
        buyerNTNCNIC: buyerValues?.ntnCnic,
        buyerBusinessName: buyerValues?.name,
        buyerProvince: buyerValues?.province,
        buyerAddress: buyerValues?.address,
        buyerRegistrationType: buyerValues?.customertype,
        invoiceRefNo: "",
        scenarioId: selectedScenarioId,
        items: submitInvoiceData,
      },
      {
        Authorization: `Bearer ${signupValues?.FBRToken}`,
      }
    );
  };

  useEffect(() => {
    const grandTotal = getProductsData.reduce((acc, currVal) => acc + currVal?.productValueAfterTax, 0);
    setGrandTotal(grandTotal);

    const newSubmitData = getProductsData.map((item) => {
      const { hsCode, description, uom, taxType, productQty, productValueBeforeTax, productValueAfterTax, furtherTax } = item;
      let furtherTaxValue = !furtherTax ? 0 : ((furtherTax / 100) ).toFixed(2);
      furtherTaxValue = parseFloat(furtherTaxValue)
      let salesTaxApplicable = ((taxType.salesTaxValue / 100) * productValueBeforeTax).toFixed(2);

      return {
        hsCode,
        productDescripion: description,
        uoM: uom,
        rate: `${taxType.salesTaxValue}%`,
        saleType: taxType.saleType,
        quantity: productQty,
        furtherTax: furtherTaxValue,
        discount: 0,
        fedPayable: 0,
        sroItemSerialNo: "",
        sroScheduleNo: "",
        salesTaxWithheldAtSource: 0,
        salesTaxApplicable: Number(salesTaxApplicable),
        valueSalesExcludingST: productValueBeforeTax,
        totalValues: Number(productValueAfterTax.toFixed(2)),
        fixedNotifiedValueOrRetailPrice: 0,
        extraTax: ""
      };
    });

    setSubmitInvoiceData(newSubmitData);
  }, [getProductsData]);

  useEffect(() => {
    const submitToLocalApi = async () => {
      const vr = data?.validationResponse;
      if (!vr) return;

      const arrayError = vr?.invoiceStatuses?.length
        ? vr.invoiceStatuses.map(s => `Item ${s.itemSNo}: ${s.error}`).join("\n")
        : null;

      const finalError = vr?.error || arrayError || "Something went wrong";

      if (vr.statusCode === "01") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: finalError,
        });
        return;
      }

      if (vr.statusCode === "00") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Invoice sent to FBR portal successfully",
        });

        const localRes = await postLocalInvoice({
          invoiceType: "Sale Invoice",
          invoiceDate: date,
          sellerNTNCNIC: signupValuesNtnCnic,
          sellerBusinessName: signupValues?.BusinessName,
          sellerProvince: signupValues?.Province,
          sellerAddress: signupValues?.Address,
          buyerNTNCNIC: buyerValues?.ntnCnic,
          buyerBusinessName: buyerValues?.name,
          buyerProvince: buyerValues?.province,
          buyerAddress: buyerValues?.address,
          buyerRegistrationType: buyerValues?.customertype,
          invoiceRefNo: "",
          scenarioId: selectedScenarioId,
          items: submitInvoiceData,
          FBRToken: signupValues?.FBRToken,
          fbrResponse: data?.invoiceNumber,
          fbrResponseDate: data?.dated,
          grandTotal,
        });

        Swal.fire({
          icon: localRes?.status ? "success" : "error",
          title: localRes?.status ? "Saved" : "Error",
          text: localRes?.status ? localRes.message : (localRes?.message || "Failed to save invoice locally"),
        });
      }
    };

    submitToLocalApi();
  }, [data]);

  return (
    <>
      {loading
        ? <Spinner />
        : (
          <div className="container-fluid py-4">
            <h2 className="page-title mb-3" style={{ color: "#E0E7E9" }}>Invoice Items</h2>

            <div className="table-responsive shadow-lg rounded-4 p-3 mt-4"
              style={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(6px)",
              }}>
              <table className="table table-hover text-center">
                <thead style={{ backgroundColor: "#0A5275", color: "#fff" }}>
                  <tr>
                    <th>Sr.No.</th>
                    <th>HS Code</th>
                    <th>Product Name</th>
                    <th>UOM</th>
                    <th>Tax Type</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Sales Tax</th>
                    <th>Further Tax</th>
                    <th>Value (Ex-Tax)</th>
                    <th>Value (All Taxes)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getProductsData?.map((item, id) => (
                    <tr key={id} style={{ backgroundColor: "#e6f2f7" }}>
                      <th>{id + 1}</th>
                      <td>{item?.hsCode}</td>
                      <td>{item?.description}</td>
                      <td>{item?.uom}</td>
                      <td>{item?.taxType.descriptionType}</td>
                      <td>{item?.productQty}</td>
                      <td>{item?.productPrice}</td>
                      <td>{item?.taxType?.salesTaxValue}%</td>
                      <td>{!item?.furtherTax ? 0 : item?.furtherTax}%</td>
                      <td>{item?.productValueBeforeTax.toFixed(2)}</td>
                      <td>{item?.productValueAfterTax.toFixed(2)}</td>
                      <td className="d-flex justify-content-center gap-2">
                        <button onClick={() => editInvoiceItem(id)} className="btn btn-sm me-2"
                          style={{
                            background: "#0A5275",
                            color: "white",
                          }}>
                          <MdModeEdit /> Edit
                        </button>
                        <button onClick={() => delInvoiceItem(id)} className="btn btn-sm btn-danger">
                          <MdDelete /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-end my-4">
              <p className="p-3 fw-bold" style={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(6px)", borderRadius: "8px"
              }}>Grand Total: {grandTotal.toFixed(2)}</p>
            </div>

            <div className="text-center">
              <button type="submit" onClick={submitInvoice} className="btn" style={{ backgroundColor: "#0A5275", color: "#fff", padding: "10px 25px", borderRadius: "8px" }}>
                Submit Invoice
              </button>
            </div>
          </div>
        )}
    </>
  );
};

export default SalesInvoice;
