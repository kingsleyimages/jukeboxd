import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ViewAllReviews() {
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Fetching reviews...');
    fetch('http://localhost:3000/api/reviews', {
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
        console.log('Fetched reviews:', data); // Log the fetched data
        setReviews(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error); // Log the error
        setErrorMessage("An error occurred while fetching reviews");
        setIsLoading(false);
      });
  }, []);

  const handleDeleteReview = (reviewId) => {
    console.log(`Deleting review with ID: ${reviewId}`);
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/api/reviews/admin/${reviewId}/delete`, {
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
  console.log('Fetched reviews data:', data); // Debugging log
  setReviews(data);
})
      .then((data) => {
        console.log('Review deleted:', data);
        setReviews(reviews.filter(review => review.id !== reviewId));
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
    <>
      <div>ViewAllReviews</div>
      <ul>
{reviews.map((review) => {
  console.log('Review ID:', review.id); // Debugging log
  return (
    <li key={review.id}>
      <p>{review.review}</p>
      <button onClick={() => handleDeleteReview(review.id)}>Delete Review</button>
      <Link to={`/admin/review/${review.id}/modify`}>
        <button>Modify Review</button>
      </Link>
    </li>
  );
})}

      </ul>
    </>
  );
}

export default ViewAllReviews;