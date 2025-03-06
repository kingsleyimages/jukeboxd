import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../../css/Admin.module.css'; 

function ModifyReview() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState('');
  const [headline, setHeadline] = useState('');
  const [rating, setRating] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [listened, setListened] = useState(false);
  const [userId, setUserId] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); 

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_PROD ||
    import.meta.env.VITE_API_BASE_URL_DEV;

  useEffect(() => {
    if (!reviewId) {
      setErrorMessage('Invalid review ID. Please go back and try again.');
      return;
    }

    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/api/reviews/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setReview(response.data.review || '');
        setHeadline(response.data.headline || '');
        setRating(response.data.rating || 0);
        setFavorite(response.data.favorite || false);
        setListened(response.data.listened || false);
        setUserId(response.data.user_id || ''); // Set the userId from the response
      })
      .catch((error) => {
        setErrorMessage('An error occurred while fetching review details');
      });
  }, [reviewId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewId) {
      setErrorMessage('Invalid review ID. Cannot submit changes.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/reviews/${id}/update`,
        { review, headline, rating, favorite, listened },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      
      setSuccessMessage('Review successfully modified');
    
      setErrorMessage('');

      
      setTimeout(() => {
        navigate(`/admin/user/${userId}/reviews`);
      }, 2000);
    } catch (error) {
      console.error('Error details:', error);
      setErrorMessage('An error occurred while modifying review details');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Modify Review</h2>
      {errorMessage && <div className={styles.message} style={{ color: 'red' }}>{errorMessage}</div>}
      {successMessage && <div className={styles.message} style={{ color: 'green' }}>{successMessage}</div>}
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