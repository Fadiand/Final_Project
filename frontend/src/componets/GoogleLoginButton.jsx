import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useUser } from "./UserContext"; // שימוש ב-UserContext

const GoogleLoginButton = () => {
    const { setUser } = useUser(); // שימוש בפונקציה setUser מתוך ה-Context

    const handleSuccess = (credentialResponse) => {
        console.log('Login Success:', credentialResponse);

        // שליחת הטוקן לשרת Django לאימות
        fetch('http://localhost:8000/api/auth/google/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: credentialResponse.credential }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Server Response:', data);

                // שמירת נתוני המשתמש ב-Context וב-localStorage
                setUser({
                    username: data.username || data.name, // לוודא שיש שדה שם משתמש או שם
                    email: data.email,
                    picture: data.picture,
                });

                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        username: data.username || data.name,
                        email: data.email,
                        picture: data.picture,
                    })
                );

                console.log("User saved in localStorage:", localStorage.getItem("user"));
            })
            .catch((err) => {
                console.error('Error:', err);
            });
    };

    const handleFailure = () => {
        console.error('Login Failed');
    };

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <div>
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleFailure}
                    style={{
                        backgroundColor: '#4285F4',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                    }}
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;
