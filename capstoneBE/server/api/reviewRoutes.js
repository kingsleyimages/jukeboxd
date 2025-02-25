const express = require("express");
const router = express.Router();
const {
  createReview,
  fetchReviewsByAlbumId,
  fetchReviewsByUserId,
  fetchReviews,
  deleteReview,
  updateReview,
} = require("../db/review.js");
const { authenticate } = require("../db/user.js");
const { authenticateToken } = require("./middlewares.js");
 = require('../db/review.js');
const { adminAuth, authenticateToken } = require('./middlewares.js');

// base route and return for the api for reviewss

// /api/reviews

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
});

// fetch all reviews for an album
router.get("/album/:albumId/", async (req, res, next) => {
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
});

// delete a review by id
router.delete("/:id/delete", async (req, res, next) => {
  try {
    const response = await deleteReview(req.params.id);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.put("/:id/update", async (req, res, next) => {
  try {
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
});

module.exports = router;
