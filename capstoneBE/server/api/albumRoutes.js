const express = require("express");
const router = express.Router();
const {
	authenticateUser,
} = require("../scripts/authenticateUser.js");

const {
	createAlbum,
	fetchAlbums,
	fetchAlbumById,
	createTracks,
	fetchTracksByAlbumId,
	markAlbumAsListened,
} = require("../db/album.js");

// base route and return for the api for albums

// /api/albums

// create and album by saving spotify information to database
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

// fetch all albums from database
router.get("/", async (req, res, next) => {
	try {
		const response = await fetchAlbums();
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

// fetch album by id from database
router.get("/:id", async (req, res, next) => {
	try {
		const response = await fetchAlbumById(req.params.id);
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

//fetch all tracks for an album
router.get("/albums/:albumId/tracks", async (req, res, next) => {
	try {
		const albumId = req.params.albumId;
		const tracks = await fetchTracksByAlbumId(albumId);
		res.status(200).send(tracks);
	} catch (error) {
		console.error("Error fetching tracks for album:", error);
		next(error);
	}
});

router.post("/listened", authenticateUser, async (req, res) => {
	try {
		const user_id = req.user.id; // Extract user ID from JWT
		const { album_id } = req.body;

		if (!album_id)
			return res.status(400).json({ error: "Album ID is required" });

		const result = await markAlbumAsListened(user_id, album_id);
		res.status(200).json(result);
	} catch (error) {
		console.error("Error marking album as listened:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
