import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = () => {
    const [user, setUser] = useState(null);

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

                // שמירת נתוני המשתמש במצב (State)
                setUser({
                    name: data.name,
                    email: data.email,
                    picture: data.picture,
                });
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
                {user && (
                    <div>
                        <h2>Welcome, {user.name}</h2>
                        <p>Email: {user.email}</p>
                        <img src={user.picture} alt="User Profile" />
                    </div>
                )}
            </div>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;
