const express = require('express');
const router = express.Router();
const { createReview } = require('../db/review.js');

router.post('', async (req, res, next) => {
  console.log('route logic');
  try {
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

module.exports = router;
