import React, { useState, useEffect } from "react";
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
      <h2>All Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className={styles.reviewCard}>
            <h3 className={styles.headline}>{review.album_name}</h3>
            <p className={styles.headline}>{review.album_name}</p>
            <img src={review.album_image} alt={review.album_name} />
            <h3 className={styles.headline}>{review.headline}</h3>
            <p className={styles.author}>By: {review.username}</p>
            <p className={styles.review}>Reviewed: {review.updated_at}</p>
            <p className={styles.review}>{review.review}</p>
            <p className={styles.rating}>Rating: {review.rating} / 5</p>
            <br />
            <p className={styles.favorite}>
              {review.favorite ? "Favorite: ❤️" : ""}
            </p>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default AllReviews;
