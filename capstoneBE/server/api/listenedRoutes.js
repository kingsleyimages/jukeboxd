const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./middlewares.js");
const {
	markAlbumAsListened,
	getlistenedto,
	getalllistened,
} = require("../db/review.js");

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

router.get("/:albumId", authenticateToken, async (req, res) => {
	const { albumId } = req.params;
	const userId = req.user?.id;
	try {
		const result = await getlistenedto(userId, albumId);
		console.log("Backend Response:", result);
		res.json({ is_listened: result.length > 0, data: result });
	} catch (error) {
		console.error("Error fetching listened status:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.get("/me", authenticateToken, async (req, res) => {
	const userId = req.user?.id;
	console.log(userId);
	try {
		const result = await getalllistened(userId);
		console.log("get add listened response: ", result);
	} catch (error) {
		console.error("error fetching all listened", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
