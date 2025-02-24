// Desc: Admin component to display all users in the system
//       This component will only be accessible to users with the role of "admin"
//       The component will make a GET request to the server to fetch all users
//       The server will verify the user's token and role before returning the data
//       The server will return an array of user objects with the following properties:
//       - id: UUID
//       - username: String
//       - email: String
//       - role: String
//       - created_at: Date
//       - updated_at: Date
//       The component will display the list of users in an unordered list
//       Each list item will display the user's email
//       The component will be rendered at the /admin route
//       The component will be exported as the default export


import React, { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token"); // Assume token is stored in localStorage
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const res = await axios.get('/api/admin/users', config);
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Admin Panel</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.email}</li>
                ))}
            </ul>
        </div>
    );
};

export default Admin;
