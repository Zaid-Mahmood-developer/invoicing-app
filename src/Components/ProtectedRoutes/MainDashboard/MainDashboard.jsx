import { tile } from "./dummyUtils"
const MainDashboard = () => {

    return (
        <div className="container-fluid main-dashboard vh-100">
            <div className="container-bg p-4 borderClass w-100">
                <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-0">Welcome, <span className="fw-bold">AHS</span></p>
                    <p className="borderClass2 mb-0 px-4 py-2">Company : <span className="fw-bold"> AHS CORPORATION </span></p>
                </div>
            </div>
            <div className="mainTileWrapper d-flex justify-content-between mt-4 flex-wrap gap-4">
                {tile.map((item, id) => {
                    const Icon = item.icon;
                    return (
                        <div key={id} className="tileWrapper p-4 borderClass">
                            <div className="d-flex align-items-center">
                                <div className="me-4">
                                    <Icon className="fs-2" />
                                </div>
                                <div>
                                    <p className="mb-0">{item.title}</p>
                                    <h3 className="mb-0">{item.number}</h3>
                                    <small>{item.currentTime}</small>
                                </div>
                            </div>
                        </div>
                    )
                })
                }
            </div>

            <div className="salesBreakdown mt-4">
                <h3 className="py-4">Today Sales Breakdown</h3>
                <div className="table-responsive">
                <table className="table table-hover borderClass text-center">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 text-uppercase">Date</th>
                            <th className="py-2 px-4 text-uppercase">Invoice #</th>
                            <th className="py-2 px-4 text-uppercase">Customer</th>
                            <th className="py-2 px-4 text-uppercase">Amount</th>
                            <th className="py-2 px-4 text-uppercase">Tax</th>
                            <th className="py-2 px-4 text-uppercase">Tax</th>
                            <th className="py-2 px-4 text-uppercase">View</th>
                            <th className="py-2 px-4 text-uppercase">Created By</th>
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
                            <td><button className="btn btn-sm btn-primary">View</button></td>
                            <td>AHS</td>
                        </tr>
                        <tr>
                            <th>Total:</th>
                            <th colSpan={2}></th>
                            <th >$118</th>
                            <th >$18</th>
                            <th colSpan={3}></th>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    )
}

export default MainDashboard
