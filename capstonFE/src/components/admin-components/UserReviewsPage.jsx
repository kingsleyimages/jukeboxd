import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../../css/Admin.module.css';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL_PROD ||
  import.meta.env.VITE_API_BASE_URL_DEV;

function UserReviewsPage() {
  const { userId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    console.log('Fetching reviews...');
    axios.get(`${API_BASE_URL}/api/admin/users/${userId}/reviews`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log('Fetched reviews:', response.data);
        setReviews(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error);
        setErrorMessage("An error occurred while fetching reviews");
        setIsLoading(false);
      });
  }, [userId]);

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
        setReviews(reviews.filter(review => review.id !== reviewId));
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
        {reviews.map((review) => (
          <li key={review.id}>
            {review.review}
            <br />
            <Link to={`/admin/reviews/${review.id}/modify`} className={styles.modifyButton}>Modify Review</Link>
            <button onClick={() => handleDeleteReview(review.id)} className={styles.deleteButton}>Delete Review</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserReviewsPage;