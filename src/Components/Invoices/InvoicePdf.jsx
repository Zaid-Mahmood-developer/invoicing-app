import logo from "../../assets/logo/logo-2.png";
import fbrLogo from "../../assets/logo/digitalInvoicingSystem-logo.png"
const InvoicePdf = ({ invoice }) => {
    return (
        <div
            id="invoice"
            style={{ width: "800px", margin: "0 auto", fontFamily: "Arial" }}
        >
            {/* HEADER */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                }}
            >


                <div style={{ textAlign: "right" }}>
                    <img src={logo} width="100" alt="logo" />
                </div>
                <div>
                    <h2 style={{ margin: 0 }}>Invoice {invoice.number}</h2>
                    <p style={{ margin: 0, fontSize: "12px" }}>
                        Invoice date: {invoice.invoiceDate}
                        <br />
                        Due date: {invoice.dueDate}
                        <br />
                        Customer Code: {invoice.customerCode}
                        <br />
                        FBR POS ID: {invoice.fbrPosId}
                    </p>
                </div>
            </div>

            <hr />

            {/* FROM / TO */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "20px 0",
                }}
            >
                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        width: "45%",
                    }}
                >
                    <strong>From</strong>
                    <br />
                    {invoice.from.name}
                    <br />
                    {invoice.from.address}
                    <br />
                    Phone: {invoice.from.phone}
                    <br />
                    Email: {invoice.from.email}
                    <br />
                    NTN: {invoice.from.ntn}
                    <br />
                </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        width: "45%",
                    }}
                >
                    <strong>To</strong>
                    <br />
                    {invoice.to.name}
                    <br />
                    {invoice.to.address}
                    <br />
                    NTN: {invoice.to.ntn}
                    <br />
                </div>
            </div>

            {/* TABLE */}
            <table
                width="100%"
                border="1"
                cellSpacing="0"
                cellPadding="6"
                style={{
                    fontSize: "12px",
                    borderCollapse: "collapse",
                }}
            >
                <thead>
                    <tr style={{ background: "#f2f2f2", textAlign: "left" }}>
                        <th>Description</th>
                        <th>GST</th>
                        <th>Unit Price</th>
                        <th>Qty</th>
                        <th>Unit</th>
                        <th>Total (excl.)</th>
                        <th>Total (incl.)</th>
                    </tr>
                </thead>

                <tbody>
                    {invoice.items.map((item, idx) => (
                        <tr key={idx}>
                            <td>{item.description}</td>
                            <td>{item.gst}</td>
                            <td>{item.unitPrice}</td>
                            <td>{item.qty}</td>
                            <td>{item.unit}</td>
                            <td>{item.totalExcl}</td>
                            <td>{item.totalIncl}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* TOTALS */}
            <div style={{display : "flex", justifyContent : "space-between" , alignItems : "center"}}>
                <div>
                    <img style={{width : "100px"}} src={fbrLogo} alt="fbr-logo" />
                </div>

                <div
                    style={{

                        fontSize: "13px",
                    }}
                >
                    <p>Total (excl. tax): {invoice.summary.totalExcl}</p>
                    <p>Total GST 25%: {invoice.summary.gst25}</p>
                    <p>Total GST 18%: {invoice.summary.gst18}</p>
                    <p>FED Payable: {invoice.summary.fed}</p>
                    <h3>Total (incl. tax): {invoice.summary.totalIncl}</h3>
                </div>
            </div>



            <hr />



            {/* FOOTER */}
            <div
                style={{
                    textAlign: "center",
                    fontSize: "12px",
                    marginTop: "20px",
                }}
            >
                <strong>WWW.TIER3.PK</strong>
                <br />
                Registered Office: {invoice.from.address}
                <br />
                Phone: {invoice.from.phone} — Email: {invoice.from.email}
                <br />
                NTN: {invoice.from.ntn}
            </div>
        </div>
    )
}

export default InvoicePdf
