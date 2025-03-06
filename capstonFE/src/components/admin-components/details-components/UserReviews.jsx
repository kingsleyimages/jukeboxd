import React from 'react';
import styles from '../../../css/Admin.module.css';

function UserReviews({ userReviews, handleDeleteReview }) {
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
                <p><strong>Headline:</strong> {review.headline}</p>
                <p><strong>Review:</strong> {review.review}</p>
                <p><strong>Rating:</strong> {review.rating}</p>
                <p><strong>Favorite:</strong> {review.favorite ? 'Yes' : 'No'}</p>
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