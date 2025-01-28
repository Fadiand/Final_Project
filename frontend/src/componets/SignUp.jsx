import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext"; // ניהול המשתמש בהקשר

function SignUp() {
  const { setUser } = useUser(); // גישה להקשר המשתמש
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true); // התחלת שליחה
      try {
        const response = await fetch("http://127.0.0.1:8000/api/signup/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // חובה כדי שה-Cookies יישלחו ויתקבלו
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Signup failed.");
        }

        const data = await response.json(); // קבלת הנתונים מהשרת
        console.log("Response from server:", data);

        if (data.session_id) {
          setUser({
            id: data.id,
            username: data.username,
            email: data.email,
            session_id: data.session_id, // שמירת ה-session_id בהקשר
          });

          console.log("Session ID:", data.session_id); // הדפסה של ה-session_id
          console.log("Cookies (client-side):", document.cookie); // בדיקה אם העוגיות נשמרו
          navigate("/"); 
        } else {
          setErrors({ server: "No session ID received from server." });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setErrors({ server: error.message || "An error occurred. Please try again." });
      } finally {
        setIsSubmitting(false); // סיום שליחה
      }
    }
  };

  const nav = useNavigate();

  function navigateToLogin() {
    nav("/login");
  }

  return (
    <>
      {/* רקע */}
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

      {/* טופס */}
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && <span className="error">{errors.username}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>
          {errors.server && <p className="error">{errors.server}</p>}
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </button>
          <span>
            Already have an account?{" "}
            <a onClick={navigateToLogin}>Log In</a>
          </span>
        </form>
      </div>
    </>
  );
}

export default SignUp;
