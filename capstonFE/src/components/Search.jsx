import React from "react";
import {
	FormControl,
	InputGroup,
	Container,
	Button,
	Card,
	Row,
} from "react-bootstrap";
import { useState, useEffect } from "react";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
	const [searchInput, setSearchInput] = useState("");
	const [accessToken, setAccessToken] = useState("");
	const [albums, setAlbums] = useState([]);

	useEffect(() => {
		let authParams = {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body:
				"grant_type=client_credentials&client_id=" +
				clientId +
				"&client_secret=" +
				clientSecret,
		};

		fetch("https://accounts.spotify.com/api/token", authParams)
			.then((result) => result.json())
			.then((data) => {
				setAccessToken(data.access_token);
			});
	}, []);

	async function addReview(e) {
		//needs to be fixed!!
		// e.preventDefault();
		// e.selectTarget;
		// const response = await fetch("", { method: "POST" });
	}

	async function search() {
		let artistParams = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + accessToken,
			},
		};

		// Get Artist
		const artistID = await fetch(
			"https://api.spotify.com/v1/search?q=" +
				searchInput +
				"&type=artist",
			artistParams
		)
			.then((result) => result.json())
			.then((data) => {
				return data.artists.items[0].id;
			});

		// Get Artist Albums
		await fetch(
			"https://api.spotify.com/v1/artists/" +
				artistID +
				"/albums?include_groups=album&market=US&limit=50",
			artistParams
		)
			.then((result) => result.json())
			.then((data) => {
				setAlbums(data.items);
			});
	}

	const handleViewDetails = async (albumId) => {
		try {
			// Check if album exists in local database
			const localResponse = await fetch(
				`http://localhost:3000/albums/${albumId}`
			);
			const localResult = await localResponse.json();

			// If album exists, navigate to that page
			if (localResult.success) {
				navigate(`/album/${albumId}`);
				return;
			}

			// If album doesn't exist, fetch it from Spotify
			const spotifyResponse = await fetch(
				`https://api.spotify.com/v1/albums/${albumId}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer YOUR_ACCESS_TOKEN`,
						"Content-Type": "application/json",
					},
				}
			);

			// Check for Spotify API errors
			if (!spotifyResponse.ok) {
				throw new Error("Failed to fetch album from Spotify");
			}

			const spotifyResult = await spotifyResponse.json();

			// Save the album to local database
			await fetch(`http://localhost:3000/albums`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(spotifyResult),
			});

			// Navigate to the new album page
			navigate(`/album/${albumId}`);
		} catch (error) {
			console.error("Error handling album details:", error);
		}
	};

	return (
		<>
			<Container>
				<InputGroup>
					<FormControl
						placeholder="Search For Artist"
						type="input"
						aria-label="Search for an Artist"
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								search();
							}
						}}
						onChange={(event) => setSearchInput(event.target.value)}
						style={{
							width: "300px",
							height: "35px",
							borderWidth: "0px",
							borderStyle: "solid",
							borderRadius: "5px",
							marginRight: "10px",
							paddingLeft: "10px",
						}}
					/>
					<Button onClick={search}>Search</Button>
					<Button onClick={addReview}>Add a Review</Button>
				</InputGroup>
			</Container>

			<Container>
				<Row
					style={{
						display: "flex",
						flexDirection: "row",
						flexWrap: "wrap",
						justifyContent: "space-around",
						alignContent: "center",
					}}
				>
					{albums.map((album) => {
						return (
							<Card
								key={album.id}
								style={{
									backgroundColor: "white",
									margin: "10px",
									borderRadius: "5px",
									marginBottom: "30px",
								}}
							>
								<Card.Img
									width={200}
									src={album.images[0].url}
									style={{
										borderRadius: "4%",
									}}
								/>
								<Card.Body>
									<Card.Title
										style={{
											whiteSpace: "wrap",
											fontWeight: "bold",
											maxWidth: "200px",
											fontSize: "18px",
											marginTop: "10px",
											color: "black",
										}}
									>
										{album.name}
									</Card.Title>
									<Card.Text
										style={{
											color: "black",
										}}
									>
										Release Date: <br /> {album.release_date}
									</Card.Text>
									<Button
										href={album.external_urls.spotify}
										style={{
											backgroundColor: "black",
											color: "white",
											fontWeight: "bold",
											fontSize: "15px",
											borderRadius: "5px",
											padding: "10px",
										}}
									>
										Album Link
									</Button>
								</Card.Body>
							</Card>
						);
					})}
				</Row>
			</Container>
		</>
	);
}

export default App;
