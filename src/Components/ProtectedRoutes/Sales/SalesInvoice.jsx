import { MdModeEdit, MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";
const SalesInvoice = ({ getProductsData, setGetProductsData, onEdit, date, sellerInfoState, editMode }) => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [buyerInfo, setBuyerInfo] = useState(null);

  const delInvoiceItem = (id) => {
    const delInvoiceItem = getProductsData.filter((_, index) => index !== id);
    setGetProductsData(delInvoiceItem);
  };

  const editInvoiceItem = (id) => {
    const findInvoiceItem = getProductsData.find((_, index) => index === id);
    onEdit(findInvoiceItem, id);
  };

  const submitInvoice = () => {
    setInvoiceData((prev) => ({
      ...prev, invoiceType: "Sale Invoice", date,
      sellerNTNCNIC: sellerInfoState.ntncninc,
      sellerBusinessName: sellerInfoState.businessname,
      sellerProvince: sellerInfoState.province,
      sellerAddress: sellerInfoState.address,
      ...buyerInfo,
    }))
  }

  useEffect(() => {
    const storedBuyerInfo = JSON.parse(localStorage.getItem("buyerInfo"));
    setBuyerInfo(storedBuyerInfo)
  }, [editMode])
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
              <th scope="col">Value (Ex-sales Tax)</th>
              <th scope="col">Value (Sales Tax)</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getProductsData?.map((item, id) => (
              <tr className="p-4" key={id}>
                <th scope="row">{id + 1}</th>
                <td>{item?.hsCode}</td>
                <td>{item?.description}</td>
                <td>{item?.uom}</td>
                <td>{item?.taxType}</td>
                <td>{item?.productQty}</td>
                <td>{item?.productPrice}</td>
                <td>18%</td>
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
            ))}
          </tbody>
        </table>
      </div>
      <div className="mx-auto text-center">
        <button onClick={submitInvoice} className="btn btn-primary">Submit Invoice</button>
      </div>
    </div>
  );
};

export default SalesInvoice;
