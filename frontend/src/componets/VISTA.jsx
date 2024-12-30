import React from "react";
import InstagramLoginButton from "./InstagramLoginButton"; // עדכני את הנתיב בהתאם למיקום הקובץ

function VISTA() {
    return (
        <div className="page-container">
            <h1> Welcome to VISTA site</h1>
            <p> a Automated photo filtering for tourism domain using deep and active learning</p>
            {/* הוספת כפתור אינסטגרם */}
            <InstagramLoginButton />
        </div>
    );
}

export default VISTA;