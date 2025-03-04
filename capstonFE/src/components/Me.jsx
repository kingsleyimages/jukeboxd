import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
import Friends from "./Friends";

function Me() {
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_PROD ||
    import.meta.env.VITE_API_BASE_URL_DEV;

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("myActivity");
  const [editFormVisible, setEditFormVisible] = useState(false);

  const [friendsActivity, setFriendsActivity] = useState({
    reviews: [],
    favorites: [],
  });
  const [isLoadingFriendsActivity, setIsLoadingFriendsActivity] =
    useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const token = localStorage.getItem("token") || null;

  useEffect(() => {
    console.log("Token in localStorage:", localStorage.getItem("token"));
    console.log("User in localStorage:", localStorage.getItem("user"));
  }, []);

  const updateSelf = async (id, username, email, password) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API response (User Data):", response.data);
      if (response.data && response.data.id) {
        const userId = response.data.id;
        const updateResponse = await axios.put(
          `${API_BASE_URL}/api/users/${userId}/edit`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("User updated:", updateResponse.data);
        setFormData({ username: "", email: "", password: "" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  };

  const userUpdate = async () => {
    try {
      console.log("Starting userUpdate...");

      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API response (User Data):", response.data);

      if (response.data && response.data.id) {
        let updatedUserData = { ...response.data };

        const reviewsResponse = await axios.get(
          `${API_BASE_URL}/api/reviews/user/${response.data.id}`
        );
        console.log("API response (User Reviews):", reviewsResponse.data);

        const reviews = reviewsResponse.data || [];

        const enhancedReviews = reviews.map((review) => ({
          ...review,
          albumName: review.headline,
        }));

        updatedUserData.reviews = enhancedReviews;

        const favoritesResponse = await axios.get(
          `${API_BASE_URL}/api/favorites/${response.data.id}`
        );
        console.log("API response (User Favorites):", favoritesResponse);
        updatedUserData.favorites = favoritesResponse.data;

        setUserData(updatedUserData);
        localStorage.setItem("user", JSON.stringify(updatedUserData));
      } else {
        console.error("User data is missing or invalid.");
      }
    } catch (apiError) {
      console.error("API fetch error:", apiError);
      if (apiError.response) {
        if (apiError.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login", {
            state: { message: "Your session expired. Please log in again." },
          });
          return;
        }
        setError(
          `Server error: ${
            apiError.response.data?.message || apiError.response.statusText
          }`
        );
      } else if (apiError.request) {
        setError(
          "Cannot connect to server. Please check your internet connection."
        );
      } else {
        setError("Failed to load account information. Please try again later.");
      }
    } finally {
      console.log("Setting loading to false...");
      setIsLoading(false);
    }
  };

  const fetchFriendsActivity = async (userId) => {
    setIsLoadingFriendsActivity(true);
    try {
      const friendsReviewsResponse = await axios.get(
        `${API_BASE_URL}/api/friends/reviews/${userId}`
      );
      console.log("Friends' Reviews:", friendsReviewsResponse.data);

      const friendsFavoritesResponse = await axios.get(
        `${API_BASE_URL}/api/favorites/friends/${userId}`
      );
      console.log("Friends' Favorites:", friendsFavoritesResponse.data);

      setFriendsActivity({
        reviews: friendsReviewsResponse.data || [],
        favorites: friendsFavoritesResponse.data || [],
      });
    } catch (error) {
      console.error("Error fetching friends' activity:", error);
    } finally {
      setIsLoadingFriendsActivity(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    userUpdate();
  }, []);

  useEffect(() => {
    if (activeTab === "friendsActivity" && userData && userData.id) {
      fetchFriendsActivity(userData.id);
    }
  }, [activeTab, userData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // show/hide edit form
  const handleFormShow = () => {
    setEditFormVisible(!editFormVisible);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // submit profile changes
  const handleEdit = async (event) => {
    event.preventDefault();
    if (!formData.username || !formData.email || formData.password === "") {
      alert("Please fill out all fields.");
      return;
    }
    await updateSelf(
      userData.id,
      formData.username,
      formData.email,
      formData.password
    );
  };

  if (isLoading) {
    return <div className="loading">Loading account information...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="account-container">
        <div className="account-header">
          <h1>My Account</h1>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>

        <div className="account-content">
          {userData ? (
            <div className="user-info">
              <h2>Account Information</h2>
              <div className="info-item">
                <div className="userData">
                  <span className="label">Username:</span>
                  <span className="value">
                    {userData.username || "Not available"}
                  </span>
                </div>

                <div className="editWrapper">
                  <button className="edit-button" onClick={handleFormShow}>
                    {editFormVisible ? "Cancel" : "Edit Profile"}
                  </button>
                  {editFormVisible && (
                    <form onSubmit={handleEdit}>
                      <label>
                        Username:
                        <input
                          type="text"
                          name="username"
                          onChange={handleChange}
                          value={formData?.username}
                          required
                        />
                      </label>
                      <label>
                        Email:
                        <input
                          type="email"
                          name="email"
                          onChange={handleChange}
                          value={formData?.email}
                          required
                        />
                      </label>
                      <label htmlFor="password">
                        Password:
                        <input
                          type="text"
                          onChange={handleChange}
                          name="password"
                          value={formData?.password}
                          required
                        />
                      </label>
                      <button className="edit-button" type="submit">
                        Save Changes
                      </button>
                    </form>
                  )}
                </div>
              </div>
              {userData.email && (
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{userData.email}</span>
                </div>
              )}

              <div className="activity-tabs">
                <button
                  className={`tab-button ${
                    activeTab === "myActivity" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("myActivity")}
                >
                  My Activity
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "friendsActivity" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("friendsActivity")}
                >
                  Friends' Activity
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "friends" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("friends")}
                >
                  See and Find Friends
                </button>
              </div>

              {activeTab === "myActivity" ? (
                <div className="account-activity">
                  <h2>Your Activity</h2>

                  {/* Favorite Albums */}
                  {userData.favorites &&
                  Array.isArray(userData.favorites) &&
                  userData.favorites.length > 0 ? (
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
                                onClick={() =>
                                  navigate(`/album/${album.spotify_id}`)
                                }
                              />
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No favorite albums yet.</p>
                  )}

                  {/* User Reviews */}
                  {userData.reviews &&
                  Array.isArray(userData.reviews) &&
                  userData.reviews.length > 0 ? (
                    <div className="reviews-section">
                      <h3>Recent Reviews</h3>
                      <ul className="reviews-list">
                        {userData.reviews.map((review, index) => (
                          <li key={index}>
                            <img
                              src={review.album_image}
                              alt={review.album_name || "Album Cover"}
                              style={{
                                width: "100px",
                                borderRadius: "8px",
                                marginTop: "5px",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                navigate(`/album/${review.album_spotify_id}`)
                              }
                            />
                            <p>
                              <strong>
                                {review.album_name ||
                                  review.album?.name ||
                                  "Unknown Album"}{" "}
                              </strong>
                            </p>
                            <span> Rating: {review.rating}/5</span>
                            <p>{review.review || "No review text provided."}</p>
                            <small>By: {review.username}</small>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>
              ) : activeTab === "friendsActivity" ? (
                <div className="friends-activity">
                  <h2>Friends' Activity</h2>

                  {isLoadingFriendsActivity ? (
                    <div className="loading">Loading friends' activity...</div>
                  ) : (
                    <>
                      {/* Friends' Favorite Albums */}
                      {friendsActivity.favorites &&
                      friendsActivity.favorites.length > 0 ? (
                        <div className="favorites-section">
                          <h3>Friends' Favorite Albums</h3>
                          <ul className="favorites-list">
                            {friendsActivity.favorites.map(
                              (favorite, index) => (
                                <li key={index}>
                                  <strong>
                                    {favorite.name || "Unknown Album"}
                                  </strong>
                                  <p>
                                    Artist:{" "}
                                    {favorite.artist || "Unknown Artist"}
                                  </p>
                                  <small>Liked by: {favorite.username}</small>
                                  {favorite.image && (
                                    <img
                                      src={favorite.image}
                                      alt={favorite.name || "Album Cover"}
                                      style={{
                                        width: "100px",
                                        borderRadius: "8px",
                                        marginTop: "5px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        navigate(
                                          `/album/${favorite.spotify_id}`
                                        )
                                      }
                                    />
                                  )}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      ) : (
                        <p>No favorite albums from friends yet.</p>
                      )}

                      {/* Friends' Reviews */}
                      {friendsActivity.reviews &&
                      friendsActivity.reviews.length > 0 ? (
                        <div className="reviews-section">
                          <h3>Friends' Recent Reviews</h3>
                          <ul className="reviews-list">
                            {friendsActivity.reviews.map((review, index) => (
                              <li key={index}>
                                <img
                                  src={review.album_image}
                                  alt={review.album_name || "Album Cover"}
                                  style={{
                                    width: "100px",
                                    borderRadius: "8px",
                                    marginTop: "5px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    navigate(
                                      `/album/${review.album_spotify_id}`
                                    )
                                  }
                                />
                                <p>
                                  <strong>
                                    {review.album_name || "Unknown Album"}
                                  </strong>
                                </p>
                                <span> Rating: {review.rating}/5</span>
                                <p>
                                  {review.review || "No review text provided."}
                                </p>
                                <small>By: {review.username}</small>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p>No reviews from friends yet.</p>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="friends">
                  <Friends />
                </div>
              )}
            </div>
          ) : (
            <p>No user data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Me;
