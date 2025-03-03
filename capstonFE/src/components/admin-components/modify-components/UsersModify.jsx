import { application } from 'express';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

function UserModify() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
   
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        setUsername(response.data.username);
        setEmail(response.data.email);
        setRole(response.data.role);
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
        setErrorMessage("An error occurred while fetching user details");
      });
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/admin/users/${userId}`, 
        { username, email, role },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      navigate(`/admin/users/${userId}`);
    } catch (error) {
      console.error('Error modifying user:', error);
      setErrorMessage("An error occurred while modifying user details");
    }
  };

  return (
    <div>
      <h2>Modify User</h2>
      {errorMessage && <div>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Role:</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default UserModify;