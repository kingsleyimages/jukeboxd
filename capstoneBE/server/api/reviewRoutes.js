const express = require('express');
const router = express.Router();
const {
  createReview,
  fetchReviewsByAlbumId,
  fetchReviewsByUserId,
} = require('../db/review.js');

router.post('/album/:albumId/create', async (req, res, next) => {
  console.log('route logic');
  try {
    console.log(req.body);
    const review = await createReview(
      req.params.albumId,
      req.body.userId,
      req.body.review,
      req.body.headline,
      req.body.rating,
      req.body.favorite
    );

    res.status(201).send(review);
  } catch (error) {
    next(error);
  }
});

router.get('/album/:albumId/', async (req, res, next) => {
  try {
    const reviews = await fetchReviewsByAlbumId(req.params.albumId);
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});
router.get('/user/:userId/', async (req, res, next) => {
  try {
    const reviews = await fetchReviewsByUserId(req.params.userId);
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
