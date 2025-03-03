const express = require("express");
const router = express.Router();
const {
	createAlbum,
	fetchAlbums,
	fetchAlbumById,
	createTracks,
	fetchTracksByAlbumId,
	markAlbumAsListened,
} = require("../db/album.js");
const { authenticateToken } = require("./middlewares.js");

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
router.post(
	"/:albumId/listened",
	authenticateToken,
	async (req, res, next) => {
		console.log("✅ API HIT: /api/albums/:albumId/listened"); // Debugging
		console.log("➡ Params albumId:", req.params.albumId);
		console.log("➡ Full Request URL:", req.originalUrl);

		try {
			const user_id = req.user?.id;
			const album_id = req.params.albumId;

			if (!user_id || !album_id) {
				console.log("❌ Missing user_id or album_id");
				return res
					.status(400)
					.json({ error: "Missing user_id or album_id" });
			}

			console.log("✅ User ID:", user_id);
			console.log("✅ Album ID:", album_id);

			const result = await markAlbumAsListened(user_id, album_id);
			console.log("✅ Database Response:", result);

			res.status(201).json(result);
		} catch (error) {
			console.error("❌ Error in /listened:", error.message);
			next(error);
		}
	}
);

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
router.get("/:albumId/tracks", async (req, res, next) => {
	try {
		const albumId = req.params.albumId;
		const tracks = await fetchTracksByAlbumId(albumId);
		res.status(200).send(tracks);
	} catch (error) {
		console.error("Error fetching tracks for album:", error);
		next(error);
	}
});

module.exports = router;
