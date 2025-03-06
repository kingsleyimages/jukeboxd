import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../../css/Admin.module.css';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL_PROD ||
  import.meta.env.VITE_API_BASE_URL_DEV;

function UserDetails() {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    console.log('Fetching user details...');
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

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (errorMessage) {
    return <div className={styles.errorMessage}>{errorMessage}</div>;
  }

  return (
    <div className={styles.userDetailsContainer}>
      <div className={styles.userDetailsHeader}>
        <h2>User Details</h2>
      </div>
      <div>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
      <div className={styles.buttonContainer}>
        <Link to={`/admin/user/${userId}/reviews`}>See User Reviews</Link>
        <Link to={`/admin/user/${userId}/comments`}>See User Comments</Link>
        <Link to={`/admin/user/${userId}/modify`}>Modify User</Link>
        <Link to={`/admin/user/${userId}/delete`}>Delete User</Link>
      </div>
    </div>
  );
}

export default UserDetails;