import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
import AccountHeader from "./UserAccount/AccountHeader";
import AccountInfo from "./UserAccount/AccountInfo";
import ActivityTabs from "./UserAccount/ActivityTab";
import MyActivity from "./UserAccount/MyActivity";
import FriendsActivity from "./UserAccount/FriendsActivity";
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
  const [friendsActivity, setFriendsActivity] = useState({
    reviews: [],
    favorites: [],
  });
  const [isLoadingFriendsActivity, setIsLoadingFriendsActivity] =
    useState(false);

  const token = localStorage.getItem("token") || null;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    userUpdate();
  }, []);

  const userUpdate = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.id) {
        let updatedUserData = { ...response.data };

        const reviewsResponse = await axios.get(
          `${API_BASE_URL}/api/reviews/user/${response.data.id}`
        );

        const reviews = reviewsResponse.data || [];
        const enhancedReviews = reviews.map((review) => ({
          ...review,
          albumName: review.headline,
        }));

        updatedUserData.reviews = enhancedReviews;

        const favoritesResponse = await axios.get(
          `${API_BASE_URL}/api/favorites/${response.data.id}`
        );
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
      setIsLoading(false);
    }
  };

  const fetchFriendsActivity = async (userId) => {
    setIsLoadingFriendsActivity(true);
    try {
      const friendsReviewsResponse = await axios.get(
        `${API_BASE_URL}/api/friends/reviews/${userId}`
      );

      const friendsFavoritesResponse = await axios.get(
        `${API_BASE_URL}/api/favorites/friends/${userId}`
      );

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
    if (activeTab === "friendsActivity" && userData && userData.id) {
      fetchFriendsActivity(userData.id);
    }
  }, [activeTab, userData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
          onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="account-container">
        <AccountHeader onLogout={handleLogout} />
        <div className="account-content">
          {userData ? (
            <>
              <AccountInfo userData={userData} />
              <ActivityTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              {activeTab === "myActivity" && <MyActivity userData={userData} />}
              {activeTab === "friendsActivity" && (
                <FriendsActivity
                  friendsActivity={friendsActivity}
                  isLoading={isLoadingFriendsActivity}
                />
              )}
              {activeTab === "friends" && <Friends />}
            </>
          ) : (
            <p>No user data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Me;