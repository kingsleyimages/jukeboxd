import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewCard from "./ReviewCard";
import styles from "../css/AlbumDetails.module.css";

const AlbumDetails = ({ token }) => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    headline: "",
    review: "",
    rating: 1,
    favorite: false,
  });

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/albums/${albumId}`
        );
        const data = await response.json();
        setAlbum(data);
        setReviews(data.reviews || []);
      } catch (error) {
        console.error("Error fetching album details:", error.message);
      }
    };

    fetchAlbumDetails();

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.id);
      } catch (error) {
        console.error("Invalid token format", error.message);
      }
    }
  }, [albumId, token]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You need to be logged in to leave a review");
      return;
    }

    try {
      const url = editingReview
        ? `http://localhost:3000/api/reviews/${editingReview.id}/update`
        : `http://localhost:3000/api/reviews/album/${albumId}/create`;

      const method = editingReview ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedReview = await response.json();
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === updatedReview.id ? updatedReview : review
          )
        );
        setEditingReview(null);
        setFormData({ headline: "", review: "", rating: 1, favorite: false });
      } else {
        console.error("Failed to save review");
      }
    } catch (err) {
      console.error("Error saving review:", err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setFormData({ headline: "", review: "", rating: 1, favorite: false });
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setFormData({
      headline: review.headline,
      review: review.review,
      rating: review.rating,
      favorite: review.favorite,
    });
    console.log("Edit review:", review);
  };

  if (!album) return <div>Loading...</div>;

  return (
    <div>
      <div className={styles.albumWrapper}>
        <h1 className={styles.title}>{album.name}</h1>
        <p className={styles.artist}>{album.artist}</p>
        <img className={styles.img} src={album.image} alt={album.name} />
      </div>

      <h2 className={styles.reviewTitle}>Reviews:</h2>
      <div className={styles.reviewWrapper}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              userId={userId}
              onEditClick={handleEditClick}
            />
          ))
        ) : (
          <p>No Reviews for this album</p>
        )}
      </div>

      {token && (
        <form onSubmit={handleSubmitReview}>
          <h2>{editingReview ? "Edit Review" : "Leave a Review"}</h2>
          <input
            type="text"
            name="headline"
            placeholder="Headline"
            value={formData.headline}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="review"
            placeholder="Write your review..."
            value={formData.review}
            onChange={handleInputChange}
            required
          />
          <input
            name="rating"
            type="number"
            min="1"
            max="5"
            placeholder="Rating (1-5)"
            value={formData.rating}
            onChange={handleInputChange}
            required
          />
          <label>
            <input
              name="favorite"
              type="checkbox"
              checked={formData.favorite}
              onChange={handleInputChange}
            />
            Mark as Favorite
          </label>
          <button type="submit">
            {editingReview ? "Update Review" : "Submit Review"}
          </button>
          {editingReview && (
            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default AlbumDetails;
