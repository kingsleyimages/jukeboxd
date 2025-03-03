const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./middlewares.js");
const { markAlbumAsListened } = require("../db/review.js");

router.post(
	"/:spotifyId",
	authenticateToken,
	async (req, res, next) => {
		try {
			const user_id = req.user?.id;
			const spotify_id = req.params.spotifyId;

			if (!user_id || !spotify_id) {
				console.log("Missing user_id or spotify_id");
				return res
					.status(400)
					.json({ error: "Missing user_id or album_id" });
			}

			console.log("User ID:", user_id);
			console.log("Album ID:", spotify_id);

			const result = await markAlbumAsListened(user_id, spotify_id);
			console.log("Database Response:", result);

			res.status(201).json(result);
		} catch (error) {
			console.error("❌ Error in /listened:", error.message);
			next(error);
		}
	}
);

module.exports = router;
