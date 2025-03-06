import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../../css/Admin.module.css';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL_PROD ||
  import.meta.env.VITE_API_BASE_URL_DEV;

function UserCommentsPage() {
  const { userId } = useParams();
  const [comments, setComments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    console.log('Fetching comments...');
    axios.get(`${API_BASE_URL}/api/admin/users/${userId}/comments`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log('Fetched comments:', response.data);
        setComments(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
        setErrorMessage("An error occurred while fetching comments");
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
    <div className={styles.userCommentsContainer}>
      <div className={styles.userCommentsHeader}>
        <h2>User Comments</h2>
      </div>
      <ul className={styles.commentList}>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.comment}
            <br />
            <Link to={`/admin/comments/${comment.id}/modify`}>Modify Comment</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserCommentsPage;