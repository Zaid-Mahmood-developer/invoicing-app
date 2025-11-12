import { Link, useNavigate } from "react-router-dom";
import { navMenu } from "../Navbar/dummyUtils";
import { useEffect, useState } from "react";
import { usePostApi } from "../../../customhooks/usePostApi";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import Spinner from "../../utils/Spinner/Spinner";
export default function MainDashboard() {
  const { refreshToken } = useSelector((state) => state?.submitStore?.loginVal);
  const logoutUrl = `${import.meta.env.VITE_API_URL}logout`;
  const { registerUser, data, loading, error } = usePostApi(logoutUrl);
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const activeLinkFunction = (id) => {
    setActiveLink(id);
  };

  const logoutBtn = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    });

    if (result.isConfirmed) {
      setLoggingOut(true)
      await registerUser({}, { Authorization: `Bearer ${refreshToken}` });
    }
  }

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  loggingOut || loading && <Spinner />

  useEffect(() => {
    if (data?.status && data?.message) {
      Swal.fire({
        icon: "success",
        title: "Logged out",
        text: data?.message,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => navigate("/"), setLoggingOut(false));
    } else if (!data?.status && data?.message) {
      setLoggingOut(false);
      Swal.fire({
        icon: "error",
        title: "Logout failed",
        text: data?.message || "Something went wrong while logging out.",
      });
    }
  }, [data?.status, data?.message])

  return (
    <Navbar
      expand="md"
      className="menu-bar shadow-sm"
      sticky="top"
    >
      <Container fluid className="d-flex align-items-center justify-content-between">
        {/* Brand Title */}
        <Navbar.Brand
          as={Link}
          to={navMenu[0].path}
          onClick={() => activeLinkFunction(0)}
          className="menu-title fw-semibold text-decoration-none"
        >
          {navMenu[0].title}
        </Navbar.Brand>

        {/* Hamburger Toggle */}
        <Navbar.Toggle
          aria-controls="main-navbar"
          className="border-0"
          style={{ backgroundColor: "var(--borderOuter-color)" }}
        />

        {/* Collapsible Menu */}
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center p-2">
            {/* Nav Links */}
            {navMenu.slice(1).map((item, id) => (
              <Nav.Link
                as={Link}
                key={id + 1}
                to={item.path}
                onClick={() => activeLinkFunction(id + 1)}
                className={`menu-title mx-2 ${activeLink === id + 1 ? "menu-active-color fw-semibold" : ""
                  }`}
              >
                {item.title}
              </Nav.Link>
            ))}

            {/* Dropdown Menu */}
            <Dropdown align="end" className="ms-md-3 mt-2 mt-md-0">
              <Dropdown.Toggle
                id="dropdown-basic"
                className="borderClass2 text-dark fw-semibold px-3 py-1"
                style={{
                  border: "none",
                  backgroundColor: "var(--borderOuter-color)",
                }}
              >
                Account
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow border-0 mt-2">
                <Dropdown.Item
                  onClick={handleChangePassword}
                  className="text-dark fw-semibold"
                >
                  Change Password
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={logoutBtn}
                  disabled={loading}
                  className="text-danger fw-semibold"
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
