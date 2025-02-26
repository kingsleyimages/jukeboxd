import React from 'react';
import styles from '../css/AlbumDetails.module.css';

const ReviewCard = ({ review }) => (
  <div className={styles.reviewCard}>
    <h3 className={styles.headline}>{review.headline}</h3>
    <p className={styles.author}>By: {review.username}</p>
    <p className={styles.review}>{review.review}</p>
    <p className={styles.rating}>Rating: {review.rating} / 5</p>
    <p className={styles.favorite}>{review.favorite ? 'Favorite: ❤️' : ''}</p>
  </div>
);

export default ReviewCard;
