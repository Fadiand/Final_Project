import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";
import {useUser} from "./UserContext";

function LogIn() {
  const {setUser} = useUser();
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
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setUser({
          username: data.username,
          email: data.email,
        });
        localStorage.setItem("user",
          JSON.stringify({
            username: data.username,
          email: data.email,
          }));
        console.log("Form submitted successfully:", formData);
        nav("/"); // נווט ל-Home או עמוד הצלחה
      } else {
        const data = await response.json();
        console.log("Server error:", data);
        setErrors({ server: "Failed to submit form. Please try again." });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ server: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <span>
              Login with Google <GoogleLoginButton />
            </span>
            <span>
              Dont have an account?{" "}
              <button onClick={navigateToSignUp}>Sign Up</button>
            </span>
          </div>
        </form>
      </div>
    </>
  );
}

export default LogIn;
