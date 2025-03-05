import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserInfo from './details-components/UserInfo';

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
        <button onClick={handleDeleteUser}>Delete User</button>
      </div>
    </div>
  );
}

export default UserDetails;