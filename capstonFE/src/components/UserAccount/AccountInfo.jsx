import React, { useState } from "react";

const AccountInfo = ({ userData }) => {
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: userData.username || "",
    email: userData.email || "",
    password: "",
  });

  const handleFormShow = () => {
    setEditFormVisible(!editFormVisible);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleEdit = (event) => {
    event.preventDefault();
    // Add logic to update user profile
  };

  return (
    <div className="user-info">
      <h2>Account Information</h2>
      <div className="info-item">
        <div className="userData">
          <span className="label">Username:</span>
          <span className="value">{userData.username || "Not available"}</span>
        </div>
        <div className="editWrapper">
          <button className="edit-button" onClick={handleFormShow}>
            {editFormVisible ? "Cancel" : "Edit Profile"}
          </button>
          {editFormVisible && (
            <form onSubmit={handleEdit}>
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  onChange={handleChange}
                  value={formData.username}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  required
                />
              </label>
              <button className="edit-button" type="submit">
                Save Changes
              </button>
            </form>
          )}
        </div>
      </div>
      {userData.email && (
        <div className="info-item">
          <span className="label">Email:</span>
          <span className="value">{userData.email}</span>
        </div>
      )}
    </div>
  );
};

export default AccountInfo;