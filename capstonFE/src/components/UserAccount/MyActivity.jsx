import React from "react";

const MyActivity = ({ userData }) => {
  return (
    <div className="account-activity">
      <h2>Your Activity</h2>
      {userData.favorites && userData.favorites.length > 0 ? (
        <div className="favorites-section">
          <h3>Favorite Albums</h3>
          <ul className="favorites-list">
            {userData.favorites.map((album, index) => (
              <li key={index}>
                <strong>{album.name || "Unknown Album"}</strong>
                <p>Artist: {album.artist || "Unknown Artist"}</p>
                {album.image && (
                  <img
                    src={album.image}
                    alt={album.name || "Album Cover"}
                    style={{
                      width: "100px",
                      borderRadius: "8px",
                      marginTop: "5px",
                      cursor: "pointer",
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No favorite albums yet.</p>
      )}
      {userData.reviews && userData.reviews.length > 0 ? (
        <div className="reviews-section">
          <h3>Recent Reviews</h3>
          <ul className="reviews-list">
            {userData.reviews.map((review, index) => (
              <li key={index}>
                <p>
                  <strong>{review.albumName || "Unknown Album"}</strong>
                </p>
                <span>Rating: {review.rating}/5</span>
                <p>{review.review || "No review text provided."}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default MyActivity;