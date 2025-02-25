import React from "react";

const ReviewCard = ({ review }) => (
  <div className="review-card">
    <h3>{review.headline}</h3>
    <p>By: {review.username}</p>
    <p>{review.review}</p>
    <p>Rating: {review.rating} / 5</p>
    <p>Favorite: {review.favorite ? "❤️" : "Not a Favorite"}</p>
  </div>
);

export default ReviewCard;
