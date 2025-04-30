import { useEffect } from "react";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";

const FacebookLoginButton = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("FB App ID:", process.env.REACT_APP_FACEBOOK_APP_ID);

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v17.0",
      });
      console.log("FB SDK initialized");
    };

    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleFBLogin = () => {
    if (!window.FB) {
      console.error("Facebook SDK not loaded yet.");
      return;
    }

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          console.log("Login success!", response);
          const accessToken = response.authResponse.accessToken;
          getFBProfileAndSendToBackend(accessToken);
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "public_profile,email" }
    );
  };

  const getFBProfileAndSendToBackend = (accessToken) => {
    window.FB.api("/me", { fields: "name,email,picture" }, async function (profile) {
      console.log("User Profile:", profile);
  
      try {
        const res = await fetch("http://localhost:8000/facebook/facebook-auth/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            access_token: accessToken,
          }),
        });
  
        const data = await res.json();
        console.log("Response from Django:", data);
  
        if (res.ok) {
          const userData = {
            username: data.username,
            email: data.email,
            session_id: data.session_id,
            is_active: data.is_active, 
            isFacebook: true,
            picture: profile.picture?.data?.url || "",
          };
  
          
          setUser(userData);
  
          localStorage.setItem("user", JSON.stringify(userData));
  
          console.log("User saved in localStorage:", localStorage.getItem("user"));
  
          // מעבר למסך הבית
          navigate("/");
        } else {
          console.error("Server error:", data);
          alert("Facebook login failed. Please try again.");
        }
      } catch (err) {
        console.error("Failed to send Facebook token to backend:", err);
        alert("Facebook login failed. Please try again.");
      }
    });
  };

  return (
    <button
      onClick={handleFBLogin}
      style={{
        padding: "10px",
        backgroundColor: "#1877f2",
        color: "white",
        border: "none",
        borderRadius: "5px",
        marginTop: "10px",
        fontWeight: "bold",
      }}
    >
      Login With Facebook
    </button>
  );
};

export default FacebookLoginButton;
