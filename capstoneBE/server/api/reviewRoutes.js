const express = require("express");
const router = express.Router();
const {
  createReview,
  fetchReviewsByAlbumId,
  fetchReviewsByUserId,
  fetchReviews,
  deleteReview,
  updateReview,
  getReviewById,
  getAllReviews,
} = require("../db/review.js");
const { authenticate } = require("../db/user.js");
const { authenticateToken, adminAuth } = require('./middlewares.js');

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


router.delete('/admin/users/:id', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    console.log(`Deleting user with ID: ${req.params.id}`);
    const user = await deleteUser(req.params.id);
    if (user) {
      res.status(200).send({ message: 'User deleted successfully' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (err) {
    console.error('error deleting user', err.message);
    res.status(500).send('unable to delete user');
  }
});


// delete a review by id (non-admin)
router.delete('/:id/delete', authenticateToken, async (req, res, next) => {
  try {
    const review = await getReviewById(req.params.id);
    if (review.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this review' });
    }
    const response = await deleteReview(req.params.id);
    res.status(200).json({ message: 'Review deleted successfully', review: response });
  } catch (error) {
    next(error);
  }
});

// update a review by id (admin only)
router.put('/admin/:id/update', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const response = await updateReview(req.params.id, req.body.review);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

// update a review by id (non-admin)
router.put("/:id/update", authenticateToken, async (req, res, next) => {
  try {
    const review = await getReviewById(req.params.id);
    if (review.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this review' });
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
});

// Get all reviews (admin only)
router.get("/admin/reviews", authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const reviews = await getAllReviews();
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

module.exports = router;