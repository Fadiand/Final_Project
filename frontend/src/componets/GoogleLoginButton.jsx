import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useUser } from "./UserContext"; 
import { useNavigate } from "react-router-dom"; 

const GoogleLoginButton = () => {
  const { setUser } = useUser(); 
  const navigate = useNavigate(); 

  const handleSuccess = (credentialResponse) => {
    console.log("Login Success:", credentialResponse);

    // שליחת הטוקן לשרת Django לאימות
    fetch("http://localhost:8000/api/auth/google/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // שולח את ה-Cookies לשרת
      body: JSON.stringify({ token: credentialResponse.credential }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to authenticate with Google.");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Server Response:", data);

        // שמירת נתוני המשתמש כולל session_id
        setUser({
          username: data.username || data.name, // לוודא שיש שדה שם משתמש או שם
          email: data.email,
          picture: data.picture,
          session_id: data.session_id, // שמירת session_id שהגיע מהשרת
        });

        // שמירת הנתונים ב-localStorage כולל session_id
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: data.username || data.name,
            email: data.email,
            picture: data.picture,
            session_id: data.session_id, // שמירת ה-session_id
          })
        );

        console.log(
          "User saved in localStorage:",
          localStorage.getItem("user")
        );

        // מעבר לנתיב חדש לאחר התחברות מוצלחת
        navigate("/"); // שנה את הנתיב לנתיב הרצוי
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Google login failed. Please try again.");
      });
  };

  const handleFailure = () => {
    console.error("Login Failed");
    alert("Google login failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleFailure}
          style={{
            backgroundColor: "#4285F4",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            cursor: "pointer",
            transition: "transform 0.2s",
            
          }}
          width="199"
          shape="pill"
          text="signin_with"
          theme="outline"
          locale="en"
          useOneTap={true}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
