import React from "react";

const FriendsActivity = ({ friendsActivity, isLoading }) => {
  if (isLoading) {
    return <div className="loading">Loading friends' activity...</div>;
  }

  return (
    <div className="friends-activity">
      <h2>Friends' Activity</h2>
      {friendsActivity.favorites && friendsActivity.favorites.length > 0 ? (
        <div className="favorites-section">
          <h3>Friends' Favorite Albums</h3>
          <ul className="favorites-list">
            {friendsActivity.favorites.map((favorite, index) => (
              <li key={index}>
                <strong>{favorite.name || "Unknown Album"}</strong>
                <p>Artist: {favorite.artist || "Unknown Artist"}</p>
                <small>Liked by: {favorite.username}</small>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No favorite albums from friends yet.</p>
      )}
      {friendsActivity.reviews && friendsActivity.reviews.length > 0 ? (
        <div className="reviews-section">
          <h3>Friends' Recent Reviews</h3>
          <ul className="reviews-list">
            {friendsActivity.reviews.map((review, index) => (
              <li key={index}>
                <p>
                  <strong>{review.album_name || "Unknown Album"}</strong>
                </p>
                <span>Rating: {review.rating}/5</span>
                <p>{review.review || "No review text provided."}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No reviews from friends yet.</p>
      )}
    </div>
  );
};

export default FriendsActivity;