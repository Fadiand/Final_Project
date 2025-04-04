import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

function Admin() {
    const { user } = useUser(); // קבלת המשתמש מה-Context
    const navigate = useNavigate();
    const [users, setUsers] = useState([]); // שמירת הנתונים מהשרת
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // טעינת הנתונים מהשרת
        fetch("http://127.0.0.1:8000/api/admin-data/", {
            method: "GET",
            credentials: "include", // כדי שה-Session ישלח עם הבקשה
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch admin data.");
                }
                return res.json();
            })
            .then((data) => {
                setUsers(data.users); // קבלת רשימת המשתמשים
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p> Loading Information ... 🔄</p>;
    if (error) return <p style={{ color: "red" }}> Error ❌: {error}</p>;

    return (
        <div className="admin-container">
            <h1> User management ⚙️ </h1>

            {/* טבלת משתמשים */}
            <table border="1" cellPadding="10" className="admin-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>superviser</th>
                        <th>Is_active</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.Is_superviser ? "yes ✅" : "no ❌"}</td>
                            <td>{user.Is_active ? "yes ✅" : "no ❌"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Admin;
