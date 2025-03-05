import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_PROD ||
    import.meta.env.VITE_API_BASE_URL_DEV;

function ViewAllUsers() {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.MODE === 'production' 
      ? import.meta.env.VITE_API_BASE_URL_PROD
      : import.meta.env.VITE_API_BASE_URL_DEV;

    console.log('Fetching users...');
    axios.get(`${API_BASE_URL}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log('Fetched users:', response.data);
        setUsers(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setErrorMessage("An error occurred while fetching users");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div>
      <h2>View All Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username}
            <br />
            <Link to={`/admin/users/${user.id}`}>See Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewAllUsers;