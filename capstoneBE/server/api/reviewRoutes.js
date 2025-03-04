const express = require("express");
const router = express.Router();
const {
	createReview,
	fetchReviewsByAlbumId,
	fetchReviewsByUserId,
	fetchReviewsDesc,
	fetchReviews,
	deleteReview,
	updateReview,
	getReviewById,
	getAllReviews,
	createReview,
	fetchReviewsByAlbumId,
	fetchReviewsByUserId,
	fetchReviewsDesc,
	fetchReviews,
	deleteReview,
	updateReview,
	getReviewById,
	getAllReviews,
} = require("../db/review.js");
const { authenticateToken } = require("./middlewares.js");

// create a review for an album
router.post(
	"/album/:albumId/create",
	authenticateToken,
	async (req, res, next) => {
		console.log("route logic");
		try {
			console.log(req.body);
			const review = await createReview(
				req.params.albumId,
				req.user.id,
				req.body.review,
				req.body.headline,
				req.body.rating,
				req.body.favorite
			);
	"/album/:albumId/create",
	authenticateToken,
	async (req, res, next) => {
		console.log("route logic");
		try {
			console.log(req.body);
			const review = await createReview(
				req.params.albumId,
				req.user.id,
				req.body.review,
				req.body.headline,
				req.body.rating,
				req.body.favorite
			);

			res.status(201).send(review);
		} catch (error) {
			next(error);
		}
	}
			res.status(201).send(review);
		} catch (error) {
			next(error);
		}
	}
);

// fetch all reviews
router.get("/", async (req, res, next) => {
	try {
		const reviews = await fetchReviews();
		res.send(reviews);
	} catch (error) {
		next(error);
	}
	try {
		const reviews = await fetchReviews();
		res.send(reviews);
	} catch (error) {
		next(error);
	}
});
router.get("/desc", async (req, res, next) => {
	try {
		const reviews = await fetchReviewsDesc();
		res.send(reviews);
	} catch (error) {
		next(error);
	}
});
router.get("/desc", async (req, res, next) => {
	try {
		const reviews = await fetchReviewsDesc();
		res.send(reviews);
	} catch (error) {
		next(error);
	}
});

// fetch all reviews for an album
router.get("/album/:albumId/", async (req, res, next) => {
	try {
		const reviews = await fetchReviewsByAlbumId(req.params.albumId);
		res.send(reviews);
	} catch (error) {
		next(error);
	}
	try {
		const reviews = await fetchReviewsByAlbumId(req.params.albumId);
		res.send(reviews);
	} catch (error) {
		next(error);
	}
});

// fetch all reviews by a user
router.get("/user/:userId/", async (req, res, next) => {
	try {
		const reviews = await fetchReviewsByUserId(req.params.userId);
		res.send(reviews);
	} catch (error) {
		next(error);
	}
	try {
		const reviews = await fetchReviewsByUserId(req.params.userId);
		res.send(reviews);
	} catch (error) {
		next(error);
	}
});

// fetch review by id
router.get("/:id", async (req, res, next) => {
	try {
		console.log("Fetching review with ID:", req.params.id); // Debugging log
		const review = await getReviewById(req.params.id);
		if (!review) {
			return res.status(404).json({ message: "Review not found" });
		}
		res.status(200).json(review);
	} catch (error) {
		console.error("Error fetching review by ID:", error);
		next(error);
	}
	try {
		console.log("Fetching review with ID:", req.params.id); // Debugging log
		const review = await getReviewById(req.params.id);
		if (!review) {
			return res.status(404).json({ message: "Review not found" });
		}
		res.status(200).json(review);
	} catch (error) {
		console.error("Error fetching review by ID:", error);
		next(error);
	}
});

// delete a review by id
router.delete(
	"/:id/delete",
	authenticateToken,
	async (req, res, next) => {
		try {
			const review = await getReviewById(req.params.id);
			if (!review) {
				return res.status(404).json({ message: "Review not found" });
			}
			if (review.user_id !== req.user.id) {
				return res
					.status(403)
					.json({
						message: "You are not authorized to delete this review",
					});
			}
			const response = await deleteReview(req.params.id);
			res
				.status(200)
				.json({
					message: "Review deleted successfully",
					review: response,
				});
		} catch (error) {
			next(error);
		}
	}
);
router.delete(
	"/:id/delete",
	authenticateToken,
	async (req, res, next) => {
		try {
			const review = await getReviewById(req.params.id);
			if (!review) {
				return res.status(404).json({ message: "Review not found" });
			}
			if (review.user_id !== req.user.id) {
				return res
					.status(403)
					.json({
						message: "You are not authorized to delete this review",
					});
			}
			const response = await deleteReview(req.params.id);
			res
				.status(200)
				.json({
					message: "Review deleted successfully",
					review: response,
				});
		} catch (error) {
			next(error);
		}
	}
);

// delete a review by id (non-admin)
router.delete(
	"/:id/delete",
	authenticateToken,
	async (req, res, next) => {
		try {
			const review = await getReviewById(req.params.id);
			if (review.user_id !== req.user.id) {
				return res.status(403).json({
					message: "You are not authorized to delete this review",
				});
			}
			const response = await deleteReview(req.params.id);
			res.status(200).json({
				message: "Review deleted successfully",
				review: response,
			});
		} catch (error) {
			next(error);
		}
	}
);



// update a review by id (non-admin)
router.put(
	"/:id/update",
	authenticateToken,
	async (req, res, next) => {
		try {
			const review = await getReviewById(req.params.id);
			if (review.user_id !== req.user.id) {
				return res
					.status(403)
					.json({
						message: "You are not authorized to update this review",
					});
			}
			const response = await updateReview(
				req.params.id,
				req.body.review,
				req.body.headline,
				req.body.rating,
				req.body.favorite
			);
			res.send(response);
		} catch (error) {
			next(error);
		}
	}
);
router.put(
	"/:id/update",
	authenticateToken,
	async (req, res, next) => {
		try {
			const review = await getReviewById(req.params.id);
			if (review.user_id !== req.user.id) {
				return res
					.status(403)
					.json({
						message: "You are not authorized to update this review",
					});
			}
			const response = await updateReview(
				req.params.id,
				req.body.review,
				req.body.headline,
				req.body.rating,
				req.body.favorite
			);
			res.send(response);
		} catch (error) {
			next(error);
		}
	}
);



module.exports = router;