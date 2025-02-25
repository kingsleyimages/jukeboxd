import React, { useEffect, useState } from "react";

function Me() {
	const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
	const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
	const REDIRECT_URI = "http://localhost:5173/callback"; // Change when deploying
	const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
	const RESPONSE_TYPE = "code";

	const [accessToken, setAccessToken] = useState("");

	// Handle "sync account" by redirecting user to Spotify login
	const handleSync = () => {
		const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
			REDIRECT_URI
		)}&response_type=${RESPONSE_TYPE}&scope=user-read-private user-read-email`;
		window.location.href = authUrl;
	};

	// Extract authorization code from URL
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");

		if (code) {
			localStorage.setItem("spotifyAuthCode", code);
			window.history.pushState({}, null, "/"); // Clean URL
		}
	}, []);

	// Exchange authorization code for access token
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
								"Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
						},
						body: new URLSearchParams({
							grant_type: "authorization_code",
							code: code,
							redirect_uri: REDIRECT_URI,
							client_id: CLIENT_ID,
							client_secret: CLIENT_SECRET,
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
				console.error("Error fetching access token:", error);
			}
		};

		fetchAccessToken();
	}, []);

	return (
		<div>
			<button onClick={handleSync}>Login</button>
			{accessToken && <p>Access Token: {accessToken}</p>}
		</div>
	);
}

export default Me;
