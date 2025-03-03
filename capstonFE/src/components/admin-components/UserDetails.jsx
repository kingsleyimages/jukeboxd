import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import UserInfo from './details-components/UserInfo';

function UserDetails() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(`Fetching details for user ${userId}...`);

    // Fetch user details
    fetch(`http://localhost:3000/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched user details:', data);
        setUser(data);
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