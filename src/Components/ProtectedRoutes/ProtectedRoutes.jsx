import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom";
import Menu from "./Navbar/Menu";
const ProtectedRoutes = () => {
    const { loginVal } = useSelector((state) => state?.submitStore);
    return loginVal ? <> <Menu /> <Outlet /> </> : <Navigate to="/" />
}

export default ProtectedRoutes


