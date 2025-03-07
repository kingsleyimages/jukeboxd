const express = require('express');
const router = express.Router();
const { authenticateToken, adminAuth } = require('./middlewares');
const { deleteUser, fetchUserById, getAllUsers, modifyUser } = require('../db/user');
const { deleteComment, updateComment, getAllComments, fetchCommentsByUserId } = require('../db/comments');
const { deleteReview, updateReview, getAllReviews, getUserReviews } = require('../db/review');

router.delete('/comments/:id', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const deletedComment = await deleteComment(req.params.id);
    res.status(200).send({ message: 'Comment deleted successfully', comment: deletedComment });
  } catch (err) {
    console.error('Error deleting comment:', err.message);
    res.status(500).send({ error: 'Unable to delete comment' });
  }
});

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

router.get('/comments', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const comments = await getAllComments();
    res.status(200).json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err.message);
    res.status(500).send({ error: 'Unable to fetch comments' });
  }
});

router.get('/users/:id/comments', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const comments = await fetchCommentsByUserId(req.params.id);
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err.message);
    res.status(500).send({ error: 'Unable to fetch comments' });
  }
});

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

router.delete('/reviews/:id', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const response = await deleteReview(req.params.id);
    res.status(200).json({ message: 'Review deleted successfully', review: response });
  } catch (error) {
    console.error('Error deleting review:', error.message);
    res.status(500).send({ error: 'Unable to delete review' });
  }
});

router.put('/reviews/:id', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const { review, headline, rating, favorite } = req.body;
    const response = await updateReview(req.params.id, review, headline, rating, favorite);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.get('/reviews', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const reviews = await getAllReviews();
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

router.get('/users', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users', err.message);
    res.status(500).send({ error: 'Unable to fetch users' });
  }
});

router.get('/users/:id', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const user = await fetchUserById(req.params.id);
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).send({ error: 'Unable to fetch user' });
  }
});

router.put('/users/:id', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    const updatedUser = await modifyUser(req.params.id, username, email, password, role);
    res.status(200).send({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).send({ error: 'Unable to update user' });
  }
});

// Add this route to handle fetching reviews by user ID
router.get('/users/:id/reviews', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const reviews = await getUserReviews(req.params.id);
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err.message);
    res.status(500).send({ error: 'Unable to fetch reviews' });
  }
});

module.exports = router;