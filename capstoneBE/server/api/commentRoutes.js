const express = require('express');
const router = express.Router();
const {
  createComment,
  fetchCommentsByReviewId,
  fetchCommentsByUserId,
  fetchComments,
  deleteComment,
  updateComment,
} = require('../db/comments.js');

// create a comment for a review
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

// fetch all comments

router.get('/', async (req, res, next) => {
  try {
    const comments = await fetchComments();
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

// fetch all comments for a review
router.get('/review/:reviewId/', async (req, res, next) => {
  try {
    const comments = await fetchCommentsByReviewId(req.params.reviewId);
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

// fetch all comments by a user
router.get('/user/:userId/', async (req, res, next) => {
  try {
    const comments = await fetchCommentsByUserId(req.params.userId);
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

// delete a comment by id
router.delete('/:id/delete', async (req, res, next) => {
  try {
    const response = await deleteComment(req.params.id);
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});
// update a comment by id
router.put('/:id/update', async (req, res, next) => {
  try {
    const response = await updateComment(req.params.id, req.body.comment);
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
