import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function ModifyReview() {
  const { reviewId } = useParams();
  console.log('reviewId from useParams:', reviewId); // Debugging log
  const navigate = useNavigate();
  const [review, setReview] = useState('');
  const [headline, setHeadline] = useState('');
  const [rating, setRating] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [listened, setListened] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // If reviewId is undefined, set an error message and return early
    if (!reviewId) {
      setErrorMessage("Invalid review ID. Please go back and try again.");
      return;
    }

    console.log('Fetching review details for reviewId:', reviewId); // Debugging log
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/api/reviews/${reviewId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched review details:', data); // Debugging log
        setReview(data.review || '');
        setHeadline(data.headline || '');
        setRating(data.rating || 0);
        setFavorite(data.favorite || false);
        setListened(data.listened || false);
      })
      .catch((error) => {
        console.error('Error fetching review details:', error);
        setErrorMessage("An error occurred while fetching review details");
      });
  }, [reviewId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewId) {
      setErrorMessage("Invalid review ID. Cannot submit changes.");
      return;
    }

    const token = localStorage.getItem('token');
    try {
      console.log('Submitting updated review details:', {
        review,
        headline,
        rating,
        favorite,
        listened,
      }); // Debugging log

      const response = await fetch(
        `http://localhost:3000/api/reviews/admin/reviews/${reviewId}/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ review, headline, rating, favorite, listened }),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      navigate(`/admin/reviews`);
    } catch (error) {
      console.error('Error modifying review:', error);
      setErrorMessage("An error occurred while modifying review details");
    }
  };

  return (
    <div>
      <h2>Modify Review</h2>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Headline:</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </div>
        <div>
          <label>Review:</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>
        <div>
          <label>Rating:</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>
        <div>
          <label>Favorite:</label>
          <input
            type="checkbox"
            checked={favorite}
            onChange={(e) => setFavorite(e.target.checked)}
          />
        </div>
        <div>
          <label>Listened:</label>
          <input
            type="checkbox"
            checked={listened}
            onChange={(e) => setListened(e.target.checked)}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default ModifyReview;
