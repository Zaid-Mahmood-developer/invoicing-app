import { Link } from "react-router-dom";
import { navMenu } from "./dummyUtils";
import { useState } from "react";

export default function Menu() {
  const [activeLink, setActiveLink] = useState(null);
  const activeLinkFunction = (id) => {
      setActiveLink(id)
  }
  
  return (
    <nav className="menu-bar d-flex align-items-center w-100 pb-4">
      {navMenu.map((item, id) => (
        id === 0 ?
          <div key={id} className="flex-grow-1">
            <h2><Link onClick={() => activeLinkFunction(id)}  className = {` menu-title text-decoration-none`}
            to={item.path}>{item.title}</Link></h2>
          </div>
          :
          <ul key={id} className="m-0 list-unstyled">
            <li className="px-4 py-2"><Link onClick={() => activeLinkFunction(id)} className={`${activeLink === id && "menu-active-color"} menu-title text-decoration-none fs-6`} to={item.path}>{item.title}</Link></li>
          </ul>
      ))}
    </nav>
  );
}
