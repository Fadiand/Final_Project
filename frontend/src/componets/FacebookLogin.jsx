import { useEffect } from "react";

const FacebookLoginButton = () => {
  useEffect(() => {
    // הדפסה לבדיקה
    console.log("FB App ID:", process.env.REACT_APP_FACEBOOK_APP_ID);

    // אתחול ה־SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v17.0", // ← הכי בטוח עכשיו
      });
      console.log("FB SDK initialized");
    };

    // בדוק אם הסקריפט כבר קיים
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
          getFBProfile();
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "public_profile,email" }
    );
  };

  const getFBProfile = () => {
    window.FB.api("/me", { fields: "name,email,picture" }, function (profile) {
      console.log("User Profile:", profile);
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
      }}
    >
      Login With Facebook
    </button>
  );
};

export default FacebookLoginButton;
