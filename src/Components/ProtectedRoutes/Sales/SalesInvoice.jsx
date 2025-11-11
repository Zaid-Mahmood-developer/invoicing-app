import { MdModeEdit, MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";
import { usePostApi } from "../../../customhooks/usePostApi";

const SalesInvoice = ({ getProductsData, setGetProductsData, onEdit, date, signupValues, editMode }) => {
  let signupValuesNtnCnic = signupValues?.NTNCNIC;
  signupValuesNtnCnic = signupValuesNtnCnic?.toString();
  const postApiUrl = import.meta.env.VITE_API_URL_FBR_SALES_URL;
  const { registerUser, data, loading, error } = usePostApi(postApiUrl);
  const [buyerInfo, setBuyerInfo] = useState(null);
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
    await registerUser({
      invoiceType: "Sale Invoice",
      invoiceDate: date,
      sellerNTNCNIC: signupValuesNtnCnic,
      sellerBusinessName: signupValues?.BusinessName,
      sellerProvince: signupValues?.Province,
      sellerAddress: signupValues?.Address,
      buyerNTNCNIC: buyerInfo?.ntnCnic,
      buyerBusinessName: buyerInfo?.name,
      buyerProvince: buyerInfo?.province,
      buyerAddress: buyerInfo?.address,
      buyerRegistrationType: buyerInfo?.customertype,
      invoiceRefNo: "",
      scenarioId: "SN026",
      items: submitInvoiceData
    },
      {
        Authorization: `Bearer ${signupValues?.FBRToken}`,
      })
    
  }
  useEffect(() => {
    const storedBuyerInfo = JSON.parse(localStorage.getItem("buyerInfo"));
    setBuyerInfo(storedBuyerInfo)
  }, [editMode])

  useEffect(() => {
    const grandTotal = getProductsData.reduce((acc, currVal) => (
      acc + currVal?.productValueAfterTax
    ), 0);
    setGrandTotal(grandTotal)
    const newSubmitData = getProductsData.map((item) => {
      const { hsCode, description, uom, taxType, productQty, productPrice, furtherTax, productValueBeforeTax, productValueAfterTax } = item;
      let furtherTaxValue = parseFloat(furtherTax);
      let productTotalValue = productValueAfterTax;
      productTotalValue = productTotalValue.toFixed(2);
      furtherTaxValue = (!furtherTaxValue ? 0 : (item?.furtherTax / 100) + productValueBeforeTax);
      let salesTaxApplicable = ((taxType.salesTaxValue / 100) * productValueBeforeTax);
      salesTaxApplicable = salesTaxApplicable.toFixed(2);
      return { hsCode, productDescripion: description, uoM: uom, rate: `${taxType.salesTaxValue}%`, saleType: taxType.descriptionType, quantity: productQty, furtherTax: furtherTaxValue, discount: 0, fedPayable: 0, sroItemSerialNo: "", sroScheduleNo: "", salesTaxWithheldAtSource: 0, salesTaxApplicable :  (Number(salesTaxApplicable)) , valueSalesExcludingST: productValueBeforeTax, totalValues: (Number(productTotalValue)), fixedNotifiedValueOrRetailPrice: 0, extraTax: "" }
    })
    setSubmitInvoiceData(newSubmitData)
  }, [getProductsData])

  useEffect(() => {
    if (data?.validationResponse?.statusCode === "00") {
      localStorage.setItem("invoiceSubmitData", JSON.stringify(data));
      alert("Invoice submitted successfully!")
    }
    else if (data?.validationResponse?.statusCode === "01") {
      alert(`Error: ${data?.validationResponse?.error}`)
    } else if (error) {
      alert(`Error: ${error}`)
    }
  }, [data, error]);
  return (
    <div className="container-fluid py-4">
      <h2 className="page-title mb-2">Invoice Items</h2>
      <div className="table-responsive">
        <table className="table my-4 text-center">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              <th scope="col">HSS Code</th>
              <th scope="col">Product Name</th>
              <th scope="col">(UOM)</th>
              <th scope="col">Tax Type</th>
              <th scope="col">Quantity</th>
              <th scope="col">Price</th>
              <th scope="col">Sales Tax</th>
              <th scope="col">Further Tax</th>
              <th scope="col">Value (Ex-Tax)</th>
              <th scope="col">Value (All Taxes)</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getProductsData?.map((item, id) => {
              console.log(item, "itemm");
              return (
                <tr className="p-4" key={id}>
                  <th scope="row">{id + 1}</th>
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
                  <td>
                    <button
                      onClick={() => editInvoiceItem(id)}
                      className="btn btn-sm btn-primary me-2"
                    >
                      <MdModeEdit /> Edit
                    </button>
                    <button
                      onClick={() => delInvoiceItem(id)}
                      className="btn btn-sm btn-danger"
                    >
                      <MdDelete /> Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="mb-4">
        <p className="float-end borderClass2 p-3 fw-bold">Grand Total : {grandTotal.toFixed(2)}</p>
      </div>
      <div className="mx-auto text-center">
        <button onClick={submitInvoice} className="btn btn-primary mt-4">Submit Invoice</button>
      </div>
    </div>
  );
};

export default SalesInvoice;
