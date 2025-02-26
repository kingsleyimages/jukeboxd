import React, { useEffect, useState } from 'react';

// This component will be used to view all users
function ViewAllUsers() {
  // Set the initial state of the users
  const [users, setUsers] = useState([]);
  // Set the initial state of the error message
  const [errorMessage, setErrorMessage] = useState("");
  // Set the initial state of the loading message
  const [isLoading, setIsLoading] = useState(true);

  // Use the useEffect hook to fetch the users from the API
  useEffect(() => {
    const token = localStorage.getItem('token'); 
    console.log('Fetching users...');
    fetch('http://localhost:3000/api/users', {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    })
      .then((response) => {
        console.log('Response:', response); // Log the response
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched users:', data); // Log the fetched data
        setUsers(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error); // Log the error
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
    <>
      <div>ViewAllUsers</div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </>
  );
}

export default ViewAllUsers;