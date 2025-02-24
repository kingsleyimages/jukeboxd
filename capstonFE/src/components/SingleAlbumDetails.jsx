import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewCard from "./ReviewCard";

const AlbumDetails = ({ token }) => {
  console.log(token);
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/albums/${albumId}`
        );
        const data = await response.json();
        setAlbum(data);
      } catch (error) {
        console.error("Error fetching album details:");
      }
    };

    fetchAlbumDetails();
  }, [albumId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const reviewData = Object.fromEntries(formData.entries());

    if (!token) {
      alert("you need to be logged in to leave a review");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/reviews/album/${albumId}/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...reviewData }),
        }
      );

      if (response.ok) {
        const newReview = await response.json();
        setReviews((prevReviews) => [newReview, ...prevReviews]);
        e.target.reset();
      } else {
        console.error("failed to create review");
      }
    } catch (err) {
      console.error("error creating review:", error.message);
    }
  };

  if (!album) return <div>Loading...</div>;
  console.log("Should show review form:", !!token);

  return (
    <div>
      <h1>{album.name}</h1>
      <p>Artist: {album.artist}</p>
      <img src={album.image} alt={album.name} />

      <h2>Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review) => <ReviewCard key={review.id} review={review} />)
      ) : (
        <p>No Reviews for this album</p>
      )}

      {token && (
        <form onSubmit={handleSubmitReview}>
          <h2>Leave a review</h2>
          <input type="text" name="headline" placeholder="Headline" required />
          <textarea name="review" placeholder="Write your review..." required />
          <input
            name="rating"
            type="number"
            min="1"
            max="5"
            placeholder="Rating (1-5)"
            required
          />
          <label>
            <input name="favorite" type="checkbox" />
            Mark as Favorite
          </label>
          <button type="submit">Submit Review</button>
        </form>
      )}
    </div>
  );
};

export default AlbumDetails;
