import React from "react";

function InstagramLoginButton() {
    const handleInstagramLogin = () => {
        const clientId = "YOUR_INSTAGRAM_CLIENT_ID"; // ה-Client ID שלך
        const redirectUri = "http://127.0.0.1:8000/instagram/callback/"; // נתיב ה-Callback שלך
        const scope = "user_profile,user_media"; // הרשאות
        const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

        // הפניה לכתובת של אינסטגרם
        window.open(instagramAuthUrl, "_blank", "width=500,height=600");
    };

    return <>
          <button onClick={handleInstagramLogin}>התחבר לאינסטגרם</button>;
           </>
}

export default InstagramLoginButton;
