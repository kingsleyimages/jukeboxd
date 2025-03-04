import { useState } from "react";

const CommentForm = ({ reviewId, onCommentAdded, token }) => {
  const [commentText, setCommentText] = useState("");
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_PROD ||
    import.meta.env.VITE_API_BASE_URL_DEV;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const response = await fetch(
      `${API_BASE_URL}/api/comments/review/${reviewId}/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      }
    );
    const newComment = await response.json();
    console.log(newComment);
    if (response.ok) {
      onCommentAdded(newComment);
      setCommentText("");
    } else {
      console.error("Failed to add comment");
    }
  };

  return (
    <form className="commentForm" onSubmit={handleSubmit}>
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write a comment..."
        required
      />
      <button type="submit">Post Comment</button>{" "}
    </form>
  );
};

export default CommentForm;
