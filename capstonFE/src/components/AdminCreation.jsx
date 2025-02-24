import React, { useState } from "react";
import axios from "axios";

const AdminCreation = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post("/create-admin", {
        username,
        email,
        password
      });
      setMessage("Admin user created successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error creating admin user.");
    }
  };

  return (
    <div>
      <h1>Create Admin User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Admin</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminCreation;
