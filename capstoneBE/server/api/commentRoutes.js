const express = require('express');
const router = express.Router();
const {
  createComment,
  fetchCommentsByReviewId,
  fetchCommentsByUserId,
} = require('../db/comments.js');

router.post('/review/:reviewId/create', async (req, res, next) => {
  console.log('route logic');
  try {
    console.log(req.body);
    const comment = await createComment(
      req.params.reviewId,
      req.body.userId,
      req.body.comment
    );

    res.status(201).send(comment);
  } catch (error) {
    next(error);
  }
});

router.get('/review/:reviewId/', async (req, res, next) => {
  try {
    const comments = await fetchCommentsByReviewId(req.params.reviewId);
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

router.get('/user/:userId/', async (req, res, next) => {
  try {
    const comments = await fetchCommentsByUserId(req.params.userId);
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
