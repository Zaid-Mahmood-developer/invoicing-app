
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Customers from "./Components/ProtectedRoutes/Customers/Customers";
import Products from "./Components/ProtectedRoutes/Products/Products";
import Sales from "./Components/ProtectedRoutes/Sales/Sales";
import CreditNote from "./Components/ProtectedRoutes/CreditNote/CreditNote";
import Users from "./Components/ProtectedRoutes/Users/Users";
import ERPIntegration from "./Components/ProtectedRoutes/ERP/ERPIntegeration";
import About from "./Components/ProtectedRoutes/About/About";
import MainDashboard from "./Components/ProtectedRoutes/MainDashboard/MainDashboard";
import Login from "./Components/Auth/Login";
import NotFound from "./Components/Auth/NotFound";
import ProtectedRoutes from "./Components/ProtectedRoutes/ProtectedRoutes";
import Signup from "./Components/Auth/Signup";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup/>} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<MainDashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/creditnote" element={<CreditNote />} />
          <Route path="/users" element={<Users />} />
          <Route path="/erp" element={<ERPIntegration />} />
          <Route path="/about" element={<About />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
