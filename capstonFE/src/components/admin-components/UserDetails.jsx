import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import UserInfo from './details-components/UserInfo';

const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

function UserDetails() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(`Fetching details for user ${userId}...`);

    // Fetch user details
    axios.get(`${API_BASE_URL}/api/users/${userId}`, {
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
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div>
      <UserInfo user={user} />
      <div>
        <Link to={`/admin/user/${userId}/reviews`}>
          <button>View User Reviews</button>
        </Link>
        <Link to={`/admin/user/${userId}/comments`}>
          <button>View User Comments</button>
        </Link>
        <Link to={`/admin/user/${userId}/modify`}>
          <button>Modify User</button>
        </Link>
      </div>
    </div>
  );
}

export default UserDetails;