import { NavLink } from "react-router-dom";
import logo from "../images/logo.png";

export default function NavBar() {
  return (
    <>
      <nav>
         <ul className="navbar">
         <img src={logo} alt="Vista Logo" className="navbar-logo" />    
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/gallery">Gallery</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
          <li>
            <NavLink to="/model_test">Model Test</NavLink>
          </li>
          <li className="button">
            
          </li>
        </ul>
      </nav>
    </>
  );
}
