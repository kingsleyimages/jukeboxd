import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_PROD ||
    import.meta.env.VITE_API_BASE_URL_DEV;
    
function UserReviewsPage() {
  const { userId } = useParams();
  const [userReviews, setUserReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(`Fetching reviews for user ${userId}...`);

    axios.get(`${API_BASE_URL}/api/reviews/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log('Fetched reviews:', response.data);
        setUserReviews(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user reviews:', error);
        setErrorMessage("An error occurred while fetching user reviews");
        setIsLoading(false);
      });
  }, [userId]);

  const handleDeleteReview = (reviewId) => {
    console.log(`Deleting review with ID: ${reviewId}`);
    const token = localStorage.getItem('token');
    axios.delete(`${API_BASE_URL}/api/reviews/admin/${reviewId}/delete`, {
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
      <h2>User Reviews</h2>
      <ul>
        {userReviews.map((review) => (
          <li key={review.id}>
            <p><strong>Headline:</strong> {review.headline}</p>
            <p><strong>Review:</strong> {review.review}</p>
            <p><strong>Rating:</strong> {review.rating}</p>
            <p><strong>Favorite:</strong> {review.favorite ? 'Yes' : 'No'}</p>
            <button onClick={() => handleDeleteReview(review.id)}>Delete Review</button>
            <Link to={`/admin/review/${review.id}/modify`}>
              <button>Modify Review</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserReviewsPage;