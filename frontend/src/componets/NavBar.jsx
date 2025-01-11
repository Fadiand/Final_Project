import React from 'react';
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";

export default function NavBar() {
  const navigate = useNavigate();

  function navigateToLogin() {
    navigate("/LogIn");
  }

  function navigateToSignUp() {
    navigate("/signup");
  }

  return (
    <nav className="navbar-container">
      <ul className="navbar">
        <li className="navbar-item logo">
          <Link to="/">
            <img src={logo} alt="Vista Logo" className="navbar-logo" />
          </Link>
        </li>
        <li className="navbar-item">
          <NavLink 
            end 
            to="/home" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Home
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink 
            to="/about"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            About
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink 
            to="/gallery"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Gallery
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink 
            to="/contact"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Contact
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink 
            to="/model_test"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Model Test
          </NavLink>
        </li>
        <li className="navbar-item buttons">
          <button onClick={navigateToLogin} className="navbar-button login">
            Log In
          </button>
          <button onClick={navigateToSignUp} className="navbar-button signup">
            Sign Up
          </button>
        </li>
      </ul>
    </nav>
  );
}

