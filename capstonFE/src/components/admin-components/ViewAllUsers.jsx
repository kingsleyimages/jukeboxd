import React, { useEffect, useState } from 'react';

function ViewAllUsers() {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [userComments, setUserComments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    console.log('Fetching users...');
    fetch('http://localhost:3000/api/users', {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    })
      .then((response) => {
        console.log('Response:', response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched users:', data);
        setUsers(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setErrorMessage("An error occurred while fetching users");
        setIsLoading(false);
      });
  }, []);

  const handleViewReviews = (userId) => {
    const token = localStorage.getItem('token');
    console.log(`Fetching reviews for user ${userId}...`);
    fetch(`http://localhost:3000/api/reviews/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log('Response:', response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched reviews:', data);
        setUserReviews(data);
        setSelectedUser(userId);
      })
      .catch((error) => {
        console.error('Error fetching user reviews:', error);
        setErrorMessage("An error occurred while fetching user reviews");
      });
  };

  const handleViewComments = (userId) => {
    const token = localStorage.getItem('token');
    console.log(`Fetching comments for user ${userId}...`);
    fetch(`http://localhost:3000/api/comments/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log('Response:', response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched comments:', data);
        setUserComments(data);
        setSelectedUser(userId);
      })
      .catch((error) => {
        console.error('Error fetching user comments:', error);
        setErrorMessage("An error occurred while fetching user comments");
      });
  };

const handleDeleteUser = (userId) => {
  const token = localStorage.getItem('token');
  console.log(`Deleting user ${userId}...`);
  fetch(`http://localhost:3000/api/users/admin/users/${userId}`, {
    method: 'DELETE',
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
      console.log('Deleted user:', data);
      setUsers(users.filter(user => user.id !== userId));
    })
    .catch((error) => {
      console.error('Error deleting user:', error);
      setErrorMessage("An error occurred while deleting the user");
    });
};

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
          <li key={user.id}>
            {user.username}
            <button onClick={() => handleViewReviews(user.id)}>View Reviews</button>
            <button onClick={() => handleViewComments(user.id)}>View Comments</button>
            <button onClick={() => handleDeleteUser(user.id)}>Delete User</button>
          </li>
        ))}
      </ul>
      {selectedUser && (
        <>
          <h2>User Reviews</h2>
          <ul>
            {userReviews.map((review) => {
              console.log('Review:', review);
              return (
                <li key={review.id}>
                  <p><strong>Headline:</strong> {review.headline}</p>
                  <p><strong>Review:</strong> {review.review}</p>
                  <p><strong>Rating:</strong> {review.rating}</p>
                  <p><strong>Favorite:</strong> {review.favorite ? 'Yes' : 'No'}</p>
                </li>
              );
            })}
          </ul>
          <h2>User Comments</h2>
          <ul>
            {userComments.map((comment) => {
              console.log('Comment:', comment);
              return (
                <li key={comment.id}>
                  <p><strong>Comment:</strong> {comment.comment}</p>
                  <p><strong>Review ID:</strong> {comment.review_id}</p>
                  <p><strong>Created At:</strong> {comment.created_at ? new Date(comment.created_at).toLocaleString() : 'N/A'}</p>
                  <p><strong>Updated At:</strong> {comment.updated_at ? new Date(comment.updated_at).toLocaleString() : 'N/A'}</p>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}

export default ViewAllUsers;