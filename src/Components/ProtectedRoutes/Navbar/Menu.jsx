import { Link } from "react-router-dom";
import { navMenu } from "../Navbar/dummyUtils";
import { useState } from "react";

export default function MainDashboard() {
  const [activeLink, setActiveLink] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const activeLinkFunction = (id) => {
    setActiveLink(id);
    setIsOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-md menu-bar w-100 pb-4">
      <div className="container-fluid">
        
        {/* Brand */}
        <div className="flex-grow-1">
          <h2 className="m-0">
            <Link
              onClick={() => activeLinkFunction(0)}
              className="menu-title text-decoration-none"
              to={navMenu[0].path}
            >
              {navMenu[0].title}
            </Link>
          </h2>
        </div>

        {/* Hamburger button (only visible < md) */}
        <button
          className="navbar-toggler ms-auto"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible menu */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto">
            {navMenu.slice(1).map((item, id) => (
              <li key={id + 1} className="nav-item px-3 py-2">
                <Link
                  onClick={() => activeLinkFunction(id + 1)}
                  className={`nav-link menu-title fs-6 ${
                    activeLink === id + 1 ? "menu-active-color" : ""
                  }`}
                  to={item.path}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
