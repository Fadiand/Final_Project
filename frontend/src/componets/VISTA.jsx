import React from "react";
import InstagramLoginButton from "./InstagramLoginButton"; // עדכני את הנתיב בהתאם למיקום הקובץ

function VISTA() {
    return (
        <div className="page-container">
            <h1>ברוך הבא לעולם התיירות</h1>
            <p>גלו את המקומות היפים ביותר בעולם דרך האתר שלנו!</p>
            {/* הוספת כפתור אינסטגרם */}
            <InstagramLoginButton />
        </div>
    );
}

export default VISTA;