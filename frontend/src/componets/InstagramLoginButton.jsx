import React from "react";

function InstagramLoginButton() {
    const handleInstagramLogin = () => {
        const clientId = "YOUR_INSTAGRAM_CLIENT_ID"; // ה-Client ID שלך
        const redirectUri = "http://127.0.0.1:8000/instagram/callback/"; // נתיב ה-Callback שלך
        const scope = "user_profile,user_media"; // הרשאות
        const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

        // IGAAIoTJ6vZAJ5BZAFAzNnpiOHBZANy0zUG40YXFBOFNLZAkhPeWZA1ZA0E3RVFVUTVkOGZArTm9raTRVN2M1RWxTUGR2WUoxWXRUbUxSSTlsS05UZAnd0V0xCb0xjdEcxYUFzUjhFYjNIeG5SOW5ydHI1emlyOXZABUU12Y1R3alVaTGFrQQZDZD
        // הפניה לכתובת של אינסטגרם
        window.open(instagramAuthUrl, "_blank", "width=500,height=600");
    };

    return <>
        <button className="instagram-login-button " onClick={handleInstagramLogin}>Log in to your Instagram to create a photo library</button>
           </>
}

export default InstagramLoginButton;
