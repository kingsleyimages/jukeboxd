import React from "react";

const ReviewCard = ({ review }) => (
  <div className="review-card">
    <h3>{review.headline}</h3>
    <p>{review.review}</p>
    <p>Rating: {review.rating} / 5</p>
    <p>Favorite: {review.favorite ? "❤️" : "Not a Favorite"}</p>
    <p>By: {review.username}</p>
  </div>
);

export default ReviewCard;
