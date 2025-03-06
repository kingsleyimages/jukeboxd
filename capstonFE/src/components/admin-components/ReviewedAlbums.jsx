import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../css/Admin.AlbumsReviewed.module.css';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL_PROD ||
  import.meta.env.VITE_API_BASE_URL_DEV;

function ReviewedAlbums() {
  const [albums, setAlbums] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Fetching albums with reviews...');
    axios.get(`${API_BASE_URL}/api/albums/reviewed`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log('Response:', response);
        if (Array.isArray(response.data)) {
          setAlbums(response.data);
        } else {
          setAlbums([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching albums with reviews:', error);
        setErrorMessage("An error occurred while fetching albums with reviews");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (errorMessage) {
    return <div className={styles.errorMessage}>{errorMessage}</div>;
  }

  return (
    <div className={styles.albumWrapperMain}>
      <div className={styles.albumWrapper}>
        <h2 className={styles.reviewTitle}>Reviewed Albums</h2>
        <ul className={styles.albumList}>
          {albums.map((album) => (
            <li key={album.id} className={styles.albumCard}>
              <h3 className={styles.title}>{album.name} by {album.artist}</h3>
              <p><strong>Spotify ID:</strong> {album.spotify_id}</p>
              <p><strong>Image:</strong> <img src={album.image} alt={album.name} className={styles.img} /></p>
              <p><strong>Spotify URL:</strong> <a href={album.spotifyUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>{album.spotifyUrl}</a></p>
              <h4 className={styles.reviewTitle}>Reviews:</h4>
              <ul className={styles.reviewList}>
                {album.reviews.map((review) => (
                  <li key={review.review_id} className={styles.reviewCard}>
                    <p className={styles.rating}><strong>Rating:</strong> {review.rating}</p>
                    <p className={styles.favorite}><strong>Favorite:</strong> {review.favorite ? 'Yes' : 'No'}</p>
                    <p className={styles.headline}><strong>Headline:</strong> {review.headline}</p>
                    <p className={styles.review}><strong>Review:</strong> {review.review}</p>
                    <p><strong>Created At:</strong> {new Date(review.review_created_at).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(review.review_updated_at).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ReviewedAlbums;