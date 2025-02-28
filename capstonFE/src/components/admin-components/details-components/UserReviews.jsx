import React from 'react';

function UserReviews({ userReviews, handleDeleteReview }) {
  return (
    <div>
      <h2>User Reviews</h2>
      <ul>
        {userReviews.map((review) => {
          console.log(`Review ID: ${review.id}`); // Add logging here
          return (
            <li key={review.id}>
              <p><strong>Headline:</strong> {review.headline}</p>
              <p><strong>Review:</strong> {review.review}</p>
              <p><strong>Rating:</strong> {review.rating}</p>
              <p><strong>Favorite:</strong> {review.favorite ? 'Yes' : 'No'}</p>
              <button onClick={() => handleDeleteReview(review.id)}>Delete Review</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default UserReviews;