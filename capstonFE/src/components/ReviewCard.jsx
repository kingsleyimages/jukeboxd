import React, { useState, useEffect } from "react";
import styles from "../css/AlbumDetails.module.css";
import CommentForm from "./CommentForm";

const ReviewCard = ({ review, userId, onEditClick, onDeleteClick, token }) => {
  const [comments, setComments] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_PROD ||
    import.meta.env.VITE_API_BASE_URL_DEV;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log("Fetching comments for review ID:", review.id);

        const response = await fetch(
          `${API_BASE_URL}/api/comments/review/${review.id}/comments`,
          {
            method: "GET",
            headers: {},
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch comments: ${errorText}`);
        }

        const data = await response.json();
        console.log("Fetched comments:", data);
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [review.id, token]); // Add token to the dependency array

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  const handleCommentAdded = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  const handleDeleteComment = async (comment) => {
    console.log("trying to delete this comment:", comment);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/comments/${comment.id}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete comment: ${errorText}`);
      }

      setComments((prevComments) =>
        prevComments.filter((c) => c.id !== comment.id)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className={styles.reviewCard}>
      <h3 className={styles.headline}>{review.headline}</h3>
      <p className={styles.author}>By: {review.username}</p>
      <p className={styles.review}>{review.review}</p>
      <p className={styles.rating}>Rating: {review.rating} / 5</p>
      <p className={styles.favorite}>{review.favorite ? "Favorite: ❤️" : ""}</p>

      {userId === review.user_id && (
        <div>
          <button
            className={styles.editButton}
            onClick={() => onEditClick(review)}
          >
            Edit Review
          </button>
          <button onClick={() => onDeleteClick(review)}>Delete Review</button>
        </div>
      )}

      <h4>Comments:</h4>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <strong>{comment.username}:</strong> {comment.comment}
              {userId === comment.user_id && (
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteComment(comment)}
                >
                  ❌ Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}

      {isLoggedIn ? (
        <div>
          <h4>Leave a Comment:</h4>
          <CommentForm
            reviewId={review.id}
            onCommentAdded={handleCommentAdded}
            token={token}
          />
        </div>
      ) : (
        <p>
          <em>Log in to leave a comment.</em>
        </p>
      )}
    </div>
  );
};

export default ReviewCard;