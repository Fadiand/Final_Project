import React, { createContext, useState, useContext, useEffect } from "react";

import axios from "axios"; // ספרייה לביצוע קריאות ל-API

// יצירת Context למידע על המשתמש
const UserContext = createContext();

// יצירת Hook מותאם אישית לשימוש ב-UserContext
export const useUser = () => useContext(UserContext);

// רכיב Provider שמנהל את המידע על המשתמש
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // בעת הטעינה הראשונה, בדוק אם יש משתמש שמור ב-localStorage
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // שמור את המשתמש ב-localStorage בכל עדכון
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    // פונקציה להתחברות
    const login = async (username, password) => {
        try {
            const response = await axios.post("http://localhost:8000/api/login/", {
                username,
                password,
            });
            const loggedInUser = response.data; // המידע על המשתמש מהשרת
            setUser(loggedInUser); // עדכון ה-Context
            localStorage.setItem("user", JSON.stringify(loggedInUser)); // שמירת המידע ב-localStorage
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            throw error.response?.data || { message: "Login failed" };
        }
    };

    // פונקציה להתנתקות
    const logout = async () => {
        try {
            await axios.post("http://localhost:8000/api/auth/logout/"); // קריאה לשרת להתנתקות
            setUser(null); // איפוס ה-Context
            localStorage.removeItem("user"); // מחיקת המידע מ-localStorage
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
