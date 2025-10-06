import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./Components/Navbar/Menu";
import Customers from "./Components/Customers/Customers";
import Products from "./Components/Products/Products";
import Sales from "./Components/Sales/Sales";
import CreditNote from "./Components/CreditNote/CreditNote";
import Users from "./Components/Users/Users";
import ERPIntegration from "./Components/ERP/ERPIntegeration";
import About from "./Components/About/About";
import MainDashboard from "./Components/MainDashboard/MainDashboard";
export default function App() {
  return (
    <Router>
      <Menu />
        <Routes>
          <Route  path="/" element={<MainDashboard/>}/>
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/creditnote" element={<CreditNote />} />
          <Route path="/users" element={<Users />} />
          <Route path="/erp" element={<ERPIntegration />} />
          <Route path="/about" element={<About />} />
        </Routes>
    </Router>
  );
}
