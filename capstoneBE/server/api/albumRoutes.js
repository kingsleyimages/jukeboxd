const express = require("express");
const router = express.Router();


const {
  createAlbum,
  fetchAlbums,
  fetchAlbumById,
  createTracks,
  fetchAlbumsWithReviews,
} = require("../db/album.js");


router.post("/create", async (req, res, next) => {
	const { spotify_id, name, artist, image, spotifyUrl, tracks } =
		req.body;
	console.log("tracks", tracks);
	try {
		const response = await createAlbum(
			spotify_id,
			name,
			artist,
			image,
			spotifyUrl,
			tracks
		);

		const trackResponse = tracks.map(async (track) => {
			await createTracks(response.id, track);
		});
		await Promise.all(trackResponse);

		const albumResponse = await fetchAlbumById(response.id);
		res.status(201).send(albumResponse);
	} catch (error) {
		next(error);
	}
});



router.get("/reviewed", async (req, res, next) => {
	try {
		console.log("API route accessed: /albums/reviewed");
		const albums = await fetchAlbumsWithReviews();
		console.log("Albums with reviews:", albums); // Add logging
		res.json(albums);
	} catch (error) {
		console.error("Error fetching albums with reviews:", error);
		res.status(500).json({
			error: "An error occurred while fetching albums with reviews",
		});
	}
});

router.get("/", async (req, res, next) => {
	try {
		const response = await fetchAlbums();
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});


router.get("/:id", async (req, res, next) => {
	try {
		const response = await fetchAlbumById(req.params.id);
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
