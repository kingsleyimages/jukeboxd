import React, { useEffect, useState } from "react";

function Me() {
	const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
	const REDIRECT_URI = "http://localhost:5173/callback"; // change whenever we deploy
	const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
	const RESPONSE_TYPE = "code";

	const [callbackCode, setCallbackCode] = useState("");
	const [accessToken, setAccessToken] = useState("");

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
					setAccessToken(data.access.token);
					localStorage.setItem(
						"spotifyAccessToken",
						data.access_token
					);
				}
				fetchAccessToken();
			} catch (error) {}
		};
	}, []);

	// fetch user specific data

	return (
		<div>
			<button onClick={handleSync}>Login</button>
		</div>
	);
}

export default Me;
