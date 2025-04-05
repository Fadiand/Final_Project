import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";
import FacebookLoginButton from "./FacebookLogin";
import { useUser } from "./UserContext";

function LogIn() {
  const { setUser } = useUser();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // נדרש עבור Cookies
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          username: data.username,
          email: data.email,
          session_id: data.session_id, // שמירת ה-session_id בהקשר
          is_superviser: data.is_superviser,
        });

        console.log("Session ID:", data.session_id); // הדפסה של ה-session_id
        console.log("Cookies (client-side):", document.cookie); // בדיקה אם העוגיות נשמרו
        console.log("Login successful:", data);
        nav("/"); 
      } else {
        const errorData = await response.json();
        console.log("Server error:", errorData);
        setErrors({ server: errorData.error || "Failed to log in. Please try again." });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrors({ server: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const changepath = () => {
    nav("/")
  }

  const nav = useNavigate();
  function navigateToSignUp() {
    nav("/signUp");
  }

  return (
    <>
      <ul className="background">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <div className="LogIn_Container">
        <form className="LogIn_Form" onSubmit={handleSubmit}>
          <h2>Log In</h2>
          <div className="Login-form-input">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="Login-form-input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {errors.server && <p className="error">{errors.server}</p>}
          <div className="Login-form-input">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Log In"}
            </button>
            <span className="Login-form-input-span" onClick={changepath}>
              <GoogleLoginButton />
            </span>
            <span className="Login-form-input-span" onClick={changepath}>
              <FacebookLoginButton/>
            </span>
            <span>
              Don't have an account?{" "}
              <a className="login_aherf" onClick={navigateToSignUp}>
                Sign Up
              </a>
            </span>
          </div>
        </form>
      </div>
    </>
  );
}

export default LogIn;
