import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.png"; // עדכני את הנתיב לתמונה

function Navbar() {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <img src={logo} alt="Vista Logo" />
            </Link>
            <ul className="navbar-links">
                <li><Link to="/">VISTA</Link></li>
                <li><Link to="/About">About</Link></li>
                <li><Link to="/Gallery">Gallery</Link></li>
                <li><Link to="/TryMeOnGallery">Try me on Gallery</Link></li>
                <li><Link to="/Contact">Contact</Link></li>
                <li><Link to="/Fidbek">Fidbek</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;