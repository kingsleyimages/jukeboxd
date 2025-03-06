import React, { useState } from 'react';
import axios from 'axios';
import styles from '../../../css/Admin.module.css';

function UserComments({ userComments, setUserComments }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_PROD ||
    import.meta.env.VITE_API_BASE_URL_DEV;

  const handleDeleteComment = (commentId) => {
    console.log(`Deleting comment with ID: ${commentId}`);
    const token = localStorage.getItem('token');
    setIsLoading(true);
    axios.delete(`${API_BASE_URL}/api/admin/comments/${commentId}`, {
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (errorMessage) {
    return <div className={styles.errorMessage}>{errorMessage}</div>;
  }

  return (
    <div className={styles.userCommentsContainer}>
      <div className={styles.userCommentsHeader}>
        <h2>User Comments</h2>
      </div>
      <ul className={styles.commentList}>
        {userComments.map((comment) => {
          console.log(`Comment ID: ${comment.id}`); // Add logging here
          return (
            <li key={comment.id}>
              <div className={styles.commentDetails}>
                <p><strong>Comment:</strong> {comment.comment}</p>
                <p><strong>Review ID:</strong> {comment.review_id}</p>
                <p><strong>Created At:</strong> {comment.created_at ? new Date(comment.created_at).toLocaleString() : 'N/A'}</p>
                <p><strong>Updated At:</strong> {comment.updated_at ? new Date(comment.updated_at).toLocaleString() : 'N/A'}</p>
                <button onClick={() => handleDeleteComment(comment.id)} className={styles.deleteButton}>Delete Comment</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default UserComments;