const express = require('express');
const router = express.Router();
const { authenticateToken, adminAuth } = require('./middlewares');
const { deleteUser } = require('../db/user');
const { deleteComment, updateComment, getAllComments } = require('../db/comments');
const { deleteReview, updateReview, getAllReviews } = require('../db/review');

// Delete comment (admin only)
router.delete('/comments/:id', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const deletedComment = await deleteComment(req.params.id);
    res.status(200).send({ message: 'Comment deleted successfully', comment: deletedComment });
  } catch (err) {
    console.error('Error deleting comment:', err.message);
    res.status(500).send({ error: 'Unable to delete comment' });
  }
});

// Update comment (admin only)
router.put('/comments/:id', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const { comment } = req.body;
    const updatedComment = await updateComment(req.params.id, comment);
    res.status(200).send({ message: 'Comment updated successfully', comment: updatedComment });
  } catch (err) {
    console.error('Error updating comment:', err.message);
    res.status(500).send({ error: 'Unable to update comment' });
  }
});

// Get all comments (admin only)
router.get('/comments', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const comments = await getAllComments();
    res.status(200).json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err.message);
    res.status(500).send({ error: 'Unable to fetch comments' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    console.log(`Admin ${req.user.id} deleting user ID: ${req.params.id}`);
    const deletedUser = await deleteUser(req.params.id);
    res.status(200).send({ message: 'User deleted successfully', user: deletedUser });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).send({ error: 'Unable to delete user' });
  }
});

// Delete review by id (admin only)
router.delete('/reviews/:id/delete', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const response = await deleteReview(req.params.id);
    res.status(200).json({ message: 'Review deleted successfully', review: response });
  } catch (error) {
    next(error);
  }
});

// Update a review by id (admin only)
router.put('/reviews/:id/update', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const { review, headline, rating, favorite } = req.body;
    const response = await updateReview(req.params.id, review, headline, rating, favorite);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

// Get all reviews (admin only)
router.get('/reviews', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const reviews = await getAllReviews();
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

module.exports = router;