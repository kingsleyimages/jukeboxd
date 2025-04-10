import PropTypes from "prop-types";

const MyActivity = ({ userData }) => {
  return (
    <div className="account-activity">
      <h2>Your Activity</h2>
      {userData.reviews && userData.reviews.length > 0 ? (
        <div className="reviews-section">
          <h3>Reviewed Albums</h3>
          <ul className="reviews-list">
            {userData.reviews.map((review, index) => (
              <li key={index} className="review-item">
                <p>
                  <strong>{review.albumName || "Unknown Album"}</strong>
                  {review.favorite && (
                    <span
                      className="favorite-indicator"
                      title="Favorite Album"
                      style={{
                        color: "gold",
                        marginLeft: "8px",
                        fontSize: "16px",
                      }}
                    >
                      ★
                    </span>
                  )}
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

MyActivity.propTypes = {
  userData: PropTypes.shape({
    reviews: PropTypes.arrayOf(
      PropTypes.shape({
        albumName: PropTypes.string,
        rating: PropTypes.number,
        review: PropTypes.string,
        favorite: PropTypes.bool, // Added favorite property
      })
    ),
  }).isRequired,
};

export default MyActivity;