import React, { useEffect, useState } from "react";

function Discover() {
	const [albums, setAlbums] = useState([]);
	const [accessToken, setAccessToken] = useState("");

	useEffect(() => {
		async function fetchAccessToken() {
			const clientId = import.meta.env.VITE_CLIENT_ID;
			const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

			if (!clientId || !clientSecret) {
				console.error(
					"Missing Spotify API credentials. Check your .env file."
				);
				return;
			}

			try {
				const response = await fetch(
					"https://accounts.spotify.com/api/token",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
							Authorization:
								"Basic " + btoa(`${clientId}:${clientSecret}`), // Correct encoding
						},
						body: "grant_type=client_credentials",
					}
				);

				const data = await response.json();

				if (!response.ok) {
					throw new Error(
						`Error fetching access token: ${
							data.error_description || "Unknown error"
						}`
					);
				}

				setAccessToken(data.access_token);
			} catch (error) {
				console.error("Failed to fetch access token:", error);
			}
		}

		fetchAccessToken();
	}, []);

	useEffect(() => {
		// UNCOMMENT WHEN BACKEND IS COMPLETE & LINE ON 116

		// async function sendAlbumsToDatabase(albums) {
		// 	try {
		// 		const response = await fetch(
		// 			"http://localhost:3000/api/albums",
		// 			{
		// 				method: "POST",
		// 				headers: {
		// 					"Content-Type": "application/json",
		// 				},
		// 				body: JSON.stringify(albums),
		// 			}
		// 		);
		// 		if (!response) {
		// 			throw new Error("Failed to save albums to database");
		// 		}
		// 		console.log("Saved albums to database");
		// 	} catch (error) {
		// 		console.error("Error sending albums to database: ", error);
		// 	}
		// }

		async function getTopAlbums() {
			if (!accessToken) return; // Ensure access token is available before making API call

			try {
				const response = await fetch(
					"https://api.spotify.com/v1/browse/new-releases?limit=50",
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${accessToken}`,
							"Content-Type": "application/json",
						},
					}
				);

				const data = await response.json();

				if (!response.ok) {
					throw new Error(
						`Error fetching albums: ${
							data.error?.message || "Unknown error"
						}`
					);
				}

				if (!data.albums || !data.albums.items) {
					throw new Error(
						"Invalid data format received from Spotify API"
					);
				}

				setAlbums(data.albums.items);
				// const formattedAlbums = data.albums.item.map((album) => ({
				// 	id: album.id,
				// 	name: album.name,
				// 	artist: album.artists[0].name,
				// 	image: album.images[0].url,
				// 	spotifyUrl: album.external_urls.spotify,
				// }));

				// sendAlbumsToDatabase(formattedAlbums); THIS AS WELL
			} catch (error) {
				console.error("Failed to fetch top albums:", error);
			}
		}

		getTopAlbums();
	}, [accessToken]); // Run only when accessToken updates

	console.log(albums);
	return (
		<div className="container">
			{albums.length > 0 ? (
				albums.map((album) => (
					<div key={album.id} className="album-card">
						<p>ID: {album.id}</p>
						<p>Name: {album.name}</p>
						<p>Artist: {album.artists[0].name}</p>
						<img
							src={album.images[0].url}
							alt={album.name}
							width={200}
						/>
						<a
							href={album.external_urls.spotify}
							target="_blank"
							rel="noopener noreferrer"
						>
							Listen on Spotify
						</a>
					</div>
				))
			) : (
				<p>Loading albums...</p>
			)}
		</div>
	);
}

export default Discover;
