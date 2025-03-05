import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserInfo from './details-components/UserInfo';
import styles from '../../css/Admin.module.css';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL_PROD ||
  import.meta.env.VITE_API_BASE_URL_DEV;

function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(`Fetching details for user ${userId}...`);

    // Fetch user details
    axios.get(`${API_BASE_URL}/api/admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log('Fetched user details:', response.data);
        setUser(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
        setErrorMessage("An error occurred while fetching user details");
        setIsLoading(false);
      });
  }, [userId]);

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    console.log(`Deleting user with ID: ${userId}`);

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('User deleted successfully');
      navigate('/admin/users'); // Redirect to the user list page after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user');
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (errorMessage) {
    return <div className={styles.errorMessage}>{errorMessage}</div>;
  }

  return (
    <div className={styles.userDetailsContainer}>
      <UserInfo user={user} className={styles.userInfo} />
      <div className={styles.buttonContainer}>
        <Link to={`/admin/user/${userId}/reviews`}>
          <button className={styles.button}>View User Reviews</button>
        </Link>
        <Link to={`/admin/user/${userId}/comments`}>
          <button className={styles.button}>View User Comments</button>
        </Link>
        <Link to={`/admin/user/${userId}/modify`}>
          <button className={styles.button}>Modify User</button>
        </Link>
        <button onClick={handleDeleteUser} className={styles.button}>Delete User</button>
      </div>
    </div>
  );
}

export default UserDetails;