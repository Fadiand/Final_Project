import React, { createContext, useState, useContext, useEffect } from "react";

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

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
