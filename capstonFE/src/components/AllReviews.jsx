import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../css/AlbumDetails.module.css";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL_PROD ||
  import.meta.env.VITE_API_BASE_URL_DEV;

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/reviews/desc`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error.message);
      }
    };

    getReviews();
  }, []);

  return (
    <div className={styles.allReviews}>
      <h1 className={styles.allReviewHeader}>Last 20 Reviews</h1>
      <div className={styles.reviewPageWrapper}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className={styles.reviewPageCard}>
              <div className={styles.albumContainer}>
                <h3 className={styles.headline}>{review.album_name}</h3>
                <p className={styles.review}>{review.album_artist}</p>
                <img src={review.album_image} alt={review.album_name} />
              </div>
              <div className={styles.reviewContainer}>
                <h3 className={styles.headline}>{review.headline}</h3>
                <p className={styles.author}>By: {review.username}</p>
                <p className={styles.updated}>On: {review.updated_at}</p>
                <p className={styles.review}>{review.review}</p>
                <p className={styles.rating}>Rating: {review.rating} / 5</p>

                <p className={styles.favorite}>
                  {review.favorite ? "Favorite: ❤️" : ""}
                </p>
                <Link
                  className={styles.linkToAlbum}
                  to={`/album/${review.album_spotify_id}`}>
                  View Album
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default AllReviews;
