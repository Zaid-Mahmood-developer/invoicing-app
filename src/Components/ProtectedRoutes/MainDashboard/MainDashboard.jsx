import { tile } from "./dummyUtils";
import { useNavigate } from "react-router-dom";
import { useGetApi } from "../../../customhooks/useGetApi";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { handlePrint, invoiceData } from "../../Invoices/InvoiceTemplate";
import InvoicePdf from "../../Invoices/InvoicePdf";
const MainDashboard = () => {
    const getUrl = `${import.meta.env.VITE_API_URL}dashboard`;
    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();
    const { data, loading, error, fetchData } = useGetApi(getUrl);
    const navigateFunc = () => {
        navigate("/creditnote");
    };

    useEffect(() => {
        if (data?.success) {
            setDashboardData(data?.data)
        }
        if (error) {
            Swal.fire("Error", error.message || "Something went wrong", "error");
        }
    }, [data, error])
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div
            className="container-fluid main-dashboard vh-100 p-4"
            style={{
                background: "linear-gradient(135deg, #0A5275 0%, #0b0b0b 100%)",
                padding: "20px",
            }}
        >
            {/* Welcome Card */}
            <div
                className="container-bg p-4 borderClass w-100"
                style={{
                    background: "rgba(255,255,255,0.88)",
                    backdropFilter: "blur(6px)",
                    borderRadius: "15px",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                    color: "#0A5275",
                }}
            >
                <p className="mb-0">
                    Welcome, <span className="fw-bold">AHS</span>
                </p>

            </div>

            {/* Tiles */}
            <div className="mainTileWrapper d-flex justify-content-between mt-4 flex-wrap gap-4">
                {tile.map((item, id) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={id}
                            className="tileWrapper p-4 borderClass"
                            style={{
                                background: "linear-gradient(135deg, #0A5275, #00a8cc)",
                                color: "#fff",
                                borderRadius: "15px",
                                boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                                minWidth: "220px",
                            }}
                        >
                            <div className="d-flex align-items-center">
                                <div className="me-4">
                                    <Icon className="fs-2" />
                                </div>
                                <div>
                                    <p className="mb-0">{item.title}</p>
                                    <h3 className="mb-0">
                                        {dashboardData?.[item.key] !== undefined
                                            ? Number(dashboardData[item.key]).toFixed(2)
                                            : "--"}
                                    </h3>
                                    <small>{item.currentTime}</small>


                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sales Table */}
            <div className="salesBreakdown mt-4">
                <h3 className="py-4" style={{ color: "#E0E7E9" }}>
                    Today Sales Breakdown
                </h3>
                <div className="table-responsive shadow-lg rounded-4 p-3 mt-4"
                    style={{
                        background: "rgba(255,255,255,0.88)",
                        backdropFilter: "blur(6px)",
                    }}
                >
                    <table
                        className="table table-hover borderClass text-center"
                        style={{
                            background: "rgba(255,255,255,0.88)",
                            backdropFilter: "blur(6px)",
                            borderRadius: "12px",
                            boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                        }}
                    >
                        <thead >
                            <tr>
                                <th className="py-2 px-4 text-uppercase">Date</th>
                                <th className="py-2 px-4 text-uppercase">Invoice #</th>
                                <th className="py-2 px-4 text-uppercase">Customer</th>
                                <th className="py-2 px-4 text-uppercase">Amount</th>
                                <th className="py-2 px-4 text-uppercase">Tax</th>
                                <th className="py-2 px-4 text-uppercase">Total</th>
                                <th colSpan={2} className="py-2 px-4 text-uppercase">
                                    View
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>20-10-2023</td>
                                <td>INV-001</td>
                                <td>John Doe</td>
                                <td>$500</td>
                                <td>$50</td>
                                <td>$550</td>
                                <td>
                                    <button onClick={handlePrint} className="btn btn-sm btn-primary">View</button>
                                </td>
                                <td style={{ display: "none" }}>
                                    <InvoicePdf invoice={invoiceData} />
                                </td>
                                <td>
                                    <button onClick={navigateFunc} className="btn btn-sm btn-success">
                                        Credit Note
                                    </button>
                                </td>
                            </tr>
                            <tr style={{ fontWeight: "600", backgroundColor: "rgba(241,247,251,0.8)" }}>
                                <td>Total:</td>
                                <td colSpan={2}></td>
                                <td>$118</td>
                                <td>$18</td>
                                <td colSpan={3}></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MainDashboard;
