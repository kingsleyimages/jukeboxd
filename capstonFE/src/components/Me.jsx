import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function Me() {
	const navigate = useNavigate();
	const API_BASE_URL = "http://localhost:3000";

	// User account states
	const [userData, setUserData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	// Friends data states
	const [friendsList, setFriendsList] = useState([]);
	const [friendsReviews, setFriendsReviews] = useState([]);
	const [friendsFavorites, setFriendsFavorites] = useState([]);
	const [isFriendsLoading, setIsFriendsLoading] = useState(false);
	const [friendsError, setFriendsError] = useState(null);
	const [activeTab, setActiveTab] = useState('myActivity'); // 'myActivity' or 'friendsActivity'

	//Spotify auth states
	const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
	const REDIRECT_URI = "http://localhost:5173/callback"; // change whenever we deploy
	const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
	const RESPONSE_TYPE = "code";
	
	const [accessToken, setAccessToken] = useState("");

	// For debugging
	useEffect(() => {
		console.log("Token in localStorage:", localStorage.getItem("token"));
		console.log("User in localStorage:", localStorage.getItem("user"));
	}, []);

	// Check authentication and fetch user data
	useEffect(() => {
		const token = localStorage.getItem("token");
		console.log("Checking token:", token ? "exists" : "missing");
		
		if (!token) {
			navigate("/login");
			return;
		}

		// Fetch user data
		const fetchUserData = async () => {
			setIsLoading(true);
			setError(null); // Reset error state before new fetch attempt
			
			try {
				// First try localStorage
				const userDataStr = localStorage.getItem("user");
				console.log("User data in localStorage:", userDataStr ? "exists" : "missing");
				
				if (userDataStr) {
					try {
						const parsedUserData = JSON.parse(userDataStr);
						console.log("Parsed user data:", parsedUserData);
						
						// Validate that we have the expected user data structure
						if (parsedUserData && parsedUserData.username) {
							setUserData(parsedUserData);
							setIsLoading(false);
							return; // Exit early if we got valid data from localStorage
						}
					} catch (parseError) {
						console.error("Error parsing user data:", parseError);
						// Continue to API fetch if parsing fails
					}
				}
				
				// If no valid user data in localStorage, fetch from API
				console.log("Fetching user data from API...");
				try {
					const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
						headers: {
							Authorization: `Bearer ${token}`
						}
					});
					
					console.log("API response:", response.data);
					
					// Ensure we have the data we need
					if (response.data && (response.data.username || (response.data.user && response.data.user.username))) {
						// Handle different API response structures
						const userData = response.data.user || response.data;
						setUserData(userData);
						
						// Store in localStorage for future use
						localStorage.setItem("user", JSON.stringify(userData));
					} else {
						throw new Error("Invalid user data format received from API");
					}
				} catch (apiError) {
					console.error("API fetch error:", apiError);
					
					// Check for specific error types and provide better messages
					if (apiError.response) {
						// The request was made and the server responded with a status code
						// that falls out of the range of 2xx
						if (apiError.response.status === 401) {
							// Token might be expired or invalid
							localStorage.removeItem("token");
							localStorage.removeItem("user");
							navigate("/login", { state: { message: "Your session has expired. Please log in again." }});
							return;
						}
						
						setError(`Server error: ${apiError.response.data?.message || apiError.response.statusText}`);
					} else if (apiError.request) {
						// The request was made but no response was received
						setError("Cannot connect to server. Please check your internet connection.");
					} else {
						// Something happened in setting up the request that triggered an Error
						setError("Failed to load account information. Please try again later.");
					}
				}
			} catch (err) {
				console.error("Error in user data flow:", err);
				setError("Failed to load account information. Please try again.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserData();
	}, [navigate, API_BASE_URL]);

	// Fetch friends data when user data is loaded
	useEffect(() => {
		if (userData && userData.id) {
			fetchFriendsData(userData.id);
		}
	}, [userData]);

	// Function to fetch friends data
	const fetchFriendsData = async (userId) => {
		setIsFriendsLoading(true);
		setFriendsError(null);
		
		try {
			const token = localStorage.getItem("token");
			
			// Fetch friends list
			const friendsResponse = await axios.get(`${API_BASE_URL}/api/friends/${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			console.log("Friends list:", friendsResponse.data);
			setFriendsList(friendsResponse.data);
			
			// Fetch friends' reviews
			const reviewsResponse = await axios.get(`${API_BASE_URL}/api/friends/reviews/${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			console.log("Friends reviews:", reviewsResponse.data);
			setFriendsReviews(reviewsResponse.data);
			
			// Fetch friends' favorites
			const favoritesResponse = await axios.get(`${API_BASE_URL}/api/favorites/friends/${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			console.log("Friends favorites:", favoritesResponse.data);
			setFriendsFavorites(favoritesResponse.data);
			
		} catch (error) {
			console.error("Error fetching friends data:", error);
			setFriendsError("Failed to load friends' activity. Please try again later.");
		} finally {
			setIsFriendsLoading(false);
		}
	};

	// handle "sync account" redirect user to the spotify login to get callback code
	const handleSync = async () => {
		const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
			REDIRECT_URI
		)}&response_type=${RESPONSE_TYPE}&scope=user-read-private user-read-email`;
		window.location.href = authUrl;
	};

	//exchange authorization code for access token
	useEffect(() => {
		const fetchAccessToken = async () => {
			const code = localStorage.getItem("spotifyAuthCode");
			if (!code) return;

			try {
				const response = await fetch(
					"https://accounts.spotify.com/api/token",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
							Authorization:
								"Basic " +
								btoa(
									`${CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`
								),
						},
						body: new URLSearchParams({
							grant_type: "authorization_code",
							code: code,
							redirect_uri: REDIRECT_URI,
						}),
					}
				);

				const data = await response.json();
				if (data.access_token) {
					setAccessToken(data.access_token);
					localStorage.setItem(
						"spotifyAccessToken",
						data.access_token
					);
				}
			} catch (error) {
				console.error("Error fetching Spotify token:", error);
			}
		};
		
		fetchAccessToken();
	}, [CLIENT_ID, REDIRECT_URI]);

	// Handle logout
	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		window.dispatchEvent(new Event("storage"));
		navigate("/login");
	};

	// Check if we have a spotifyAccessToken
	useEffect(() => {
		const token = localStorage.getItem("spotifyAccessToken");
		if (token) {
			setAccessToken(token);
		}
	}, []);

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
					<button
						className="logout-button"
						onClick={handleLogout}
					>
						Log Out
					</button>
				</div>
				
				<div className="account-content">
					{userData ? (
						<div className="user-info">
							<h2>Account Information</h2>
							<div className="info-item">
								<span className="label">Username:</span>
								<span className="value">{userData.username || "Not available"}</span>
							</div>
							{userData.email && (
								<div className="info-item">
									<span className="label">Email:</span>
									<span className="value">{userData.email}</span>
								</div>
							)}
							
							{/* Activity tabs */}
							<div className="activity-tabs">
								<button 
									className={`tab-button ${activeTab === 'myActivity' ? 'active' : ''}`}
									onClick={() => setActiveTab('myActivity')}
								>
									My Activity
								</button>
								<button 
									className={`tab-button ${activeTab === 'friendsActivity' ? 'active' : ''}`}
									onClick={() => setActiveTab('friendsActivity')}
								>
									Friends' Activity
								</button>
							</div>
							
							{activeTab === 'myActivity' ? (
								<div className="account-activity">
									<h2>Your Activity</h2>
									{userData.favorites && userData.favorites.length > 0 ? (
										<div className="favorites-section">
											<h3>Favorite Albums</h3>
											<ul className="favorites-list">
												{userData.favorites.map((favorite) => (
													<li key={favorite.id || favorite._id}>
														{favorite.albumName || favorite.title || "Unknown Album"}
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
												{userData.reviews.map((review) => (
													<li key={review.id || review._id}>
														{review.albumName || review.title || "Unknown Album"} - Rating: {review.rating}/5
													</li>
												))}
											</ul>
										</div>
									) : (
										<p>No reviews yet.</p>
									)}
								</div>
							) : (
								<div className="friends-activity">
									<h2>Friends' Activity</h2>
									
									{isFriendsLoading ? (
										<div className="loading-mini">Loading friends' activity...</div>
									) : friendsError ? (
										<div className="error-mini">{friendsError}</div>
									) : (
										<>
											{friendsList && friendsList.length > 0 ? (
												<>
													<div className="friends-section">
														<h3>Your Friends</h3>
														<ul className="friends-list">
															{friendsList.map((friend, index) => (
																<li key={index} className="friend-item">
																	{friend.username}
																</li>
															))}
														</ul>
													</div>
													
													{friendsFavorites && friendsFavorites.length > 0 ? (
														<div className="friends-favorites-section">
															<h3>Friends' Favorite Albums</h3>
															<ul className="favorites-list">
																{friendsFavorites.map((favorite, index) => (
																	<li key={index} className="favorite-item">
																		<span className="album-name">{favorite.name || "Unknown Album"}</span>
																		<span className="friend-name">Liked by: {favorite.username}</span>
																	</li>
																))}
															</ul>
														</div>
													) : (
														<p>Your friends haven't favorited any albums yet.</p>
													)}
													
													{friendsReviews && friendsReviews.length > 0 ? (
														<div className="friends-reviews-section">
															<h3>Friends' Recent Reviews</h3>
															<ul className="reviews-list">
																{friendsReviews.map((review, index) => (
																	<li key={index} className="review-item">
																		<div className="review-header">
																			<span className="review-title">{review.headline || "Review"}</span>
																			<span className="review-rating">Rating: {review.rating}/5</span>
																		</div>
																		<div className="review-content">{review.review}</div>
																		<div className="review-by">By: {review.username}</div>
																	</li>
																))}
															</ul>
														</div>
													) : (
														<p>Your friends haven't reviewed any albums yet.</p>
													)}
												</>
											) : (
												<div className="no-friends">
													<p>You don't have any friends yet. Connect with other users to see their activity!</p>
												</div>
											)}
										</>
									)}
								</div>
							)}
						</div>
					) : (
						<p>No user data available.</p>
					)}
					
					<div className="spotify-section">
						<h2>Spotify Integration</h2>
						{accessToken ? (
							<div>
								<p>Your Spotify account is connected!</p>
								<button onClick={() => {
									localStorage.removeItem("spotifyAccessToken");
									localStorage.removeItem("spotifyAuthCode");
									setAccessToken("");
								}} className="disconnect-button">Disconnect Spotify</button>
							</div>
						) : (
							<div>
								<p>Connect your Spotify account to import your playlists and favorite artists</p>
								<button onClick={handleSync} className="connect-button">Connect with Spotify</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Me;
