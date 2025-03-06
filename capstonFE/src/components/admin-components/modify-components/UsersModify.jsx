import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../../css/Admin.module.css'; // Import the styles

function UserModify() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Add state for success message
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_PROD ||
    import.meta.env.VITE_API_BASE_URL_DEV;

  useEffect(() => {
    if (!userId) {
      setErrorMessage('Invalid user ID. Please go back and try again.');
      return;
    }

    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/api/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        setErrorMessage('An error occurred while fetching user details');
      });
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setErrorMessage('Invalid user ID. Cannot submit changes.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/users/${userId}`,
        user,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Set success message
      setSuccessMessage('User successfully modified');
      // Clear error message
      setErrorMessage('');

      // Navigate back to the users list page after a delay
      setTimeout(() => {
        navigate(`/admin/users`);
      }, 2000);
    } catch (error) {
      setErrorMessage('An error occurred while modifying user details');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Modify User</h2>
      {errorMessage && <div className={styles.message} style={{ color: 'red' }}>{errorMessage}</div>}
      {successMessage && <div className={styles.message} style={{ color: 'green' }}>{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={user.name || ''}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            style={{ color: 'black', backgroundColor: 'white' }} // Add styles to make text visible
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={user.email || ''}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            style={{ color: 'black', backgroundColor: 'white' }} // Add styles to make text visible
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default UserModify;