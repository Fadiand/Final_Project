import React from 'react';
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { useUser } from "./UserContext"; // חיבור ל-UserContext

export default function NavBar() {
  const { user, setUser } = useUser(); // קבלת המידע על המשתמש
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault(); // ביטול ברירת המחדל של הניווט
    setUser(null); // איפוס מצב המשתמש
    localStorage.removeItem("user"); // מחיקת המידע מה-localStorage
    navigate("/"); // ניתוב לעמוד הבית
  };

  return (
    <nav className="navbar-container">
      <ul className="navbar">
        {/* לוגו */}
        <li className="navbar-item logo">
          <Link to="/">
            <img src={logo} alt="Vista Logo" className="navbar-logo" />
          </Link>
        </li>

        {/* קישורים */}
        <li className="navbar-item">
          <NavLink
            end
            to="/home"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            About
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink
            to="/gallery"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Gallery
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Contact
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink
            to="/model_test"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Model Test
          </NavLink>
        </li>

        {/* כפתורים */}
        <li className="navbar-item buttons">
          {user ? (
            <>
              <span className="welcome-message">Hi, {user.username || "Guest"}</span>
              <a
                href="/"
                onClick={handleLogout}
                className="navbar-button logout"
              >
                Logout
              </a>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/LogIn")}
                className="navbar-button login"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="navbar-button signup"
              >
                Sign Up
              </button>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
}
