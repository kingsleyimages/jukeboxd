import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL_PROD ||
  import.meta.env.VITE_API_BASE_URL_DEV;

function UserCommentsPage() {
  const { userId } = useParams();
  const [userComments, setUserComments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(`Fetching comments for user ${userId}...`);

    axios.get(`${API_BASE_URL}/api/comments/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log('Fetched comments:', response.data);
        setUserComments(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user comments:', error);
        setErrorMessage("An error occurred while fetching user comments");
        setIsLoading(false);
      });
  }, [userId]);

  const handleDeleteComment = (commentId) => {
    console.log(`Deleting comment with ID: ${commentId}`);
    const token = localStorage.getItem('token');
    axios.delete(`${API_BASE_URL}/api/admin/comments/${commentId}/delete`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log('Comment deleted:', response.data);
        setUserComments(userComments.filter(comment => comment.id !== commentId));
      })
      .catch((error) => {
        console.error('Error deleting comment:', error);
        setErrorMessage("An error occurred while deleting the comment");
      });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div>
      <h2>User Comments</h2>
      <ul>
        {userComments.map((comment) => (
          <li key={comment.id}>
            <p><strong>Comment:</strong> {comment.comment}</p>
            <p><strong>Review ID:</strong> {comment.review_id}</p>
            <p><strong>Created At:</strong> {comment.created_at ? new Date(comment.created_at).toLocaleString() : 'N/A'}</p>
            <p><strong>Updated At:</strong> {comment.updated_at ? new Date(comment.updated_at).toLocaleString() : 'N/A'}</p>
            <button onClick={() => handleDeleteComment(comment.id)}>Delete Comment</button>
            <Link to={`/admin/comment/${comment.id}/modify`}>
              <button>Modify Comment</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserCommentsPage;