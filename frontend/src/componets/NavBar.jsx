import React from 'react';
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { useUser } from "./UserContext"; // חיבור ל-UserContext

export default function NavBar() {
  const { user, setUser } = useUser(); // קבלת המידע על המשתמש
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault(); 

    console.log("Attempting logout with email:", user?.email); // ✅ בדיקה

    try {
      const response = await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // שולח את ה-Cookies לשרת
        body: JSON.stringify({
          username: user.username,
          email:user.email
        })
      });
  
      if (response.ok) {
        setUser(null); 
        localStorage.removeItem("user"); 
        navigate("/"); 
      } else {
        const errorData = await response.json();
        console.error("Logout failed:", errorData.error);
        alert(errorData.error || "Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
      alert("An error occurred. Please try again.");
    }
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
                className="navbar-logout"
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