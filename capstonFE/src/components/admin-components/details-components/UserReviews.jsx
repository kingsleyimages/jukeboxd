import React, { useState } from 'react';
import axios from 'axios';
import styles from '../../../css/Admin.module.css';

function UserReviews({ userReviews, setUserReviews }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_PROD ||
    import.meta.env.VITE_API_BASE_URL_DEV;

  const handleDeleteReview = (reviewId) => {
    console.log(`Deleting review with ID: ${reviewId}`);
    const token = localStorage.getItem('token');
    setIsLoading(true);
    axios.delete(`${API_BASE_URL}/api/admin/reviews/${reviewId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log('Review deleted:', response.data);
        setUserReviews(userReviews.filter(review => review.id !== reviewId));
      })
      .catch((error) => {
        console.error('Error deleting review:', error);
        setErrorMessage("An error occurred while deleting the review");
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
    <div className={styles.userReviewsContainer}>
      <div className={styles.userReviewsHeader}>
        <h2>User Reviews</h2>
      </div>
      <ul className={styles.reviewList}>
        {userReviews.map((review) => {
          console.log(`Review ID: ${review.id}`); // Add logging here
          return (
            <li key={review.id}>
              <div className={styles.reviewDetails}>
                <p><strong>Review:</strong> {review.review}</p>
                <p><strong>Album ID:</strong> {review.album_id}</p>
                <p><strong>Created At:</strong> {review.created_at ? new Date(review.created_at).toLocaleString() : 'N/A'}</p>
                <p><strong>Updated At:</strong> {review.updated_at ? new Date(review.updated_at).toLocaleString() : 'N/A'}</p>
                <button onClick={() => handleDeleteReview(review.id)} className={styles.deleteButton}>Delete Review</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default UserReviews;