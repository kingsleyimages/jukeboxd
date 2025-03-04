const express = require('express');
const router = express.Router();
const { authenticateToken, adminAuth } = require('./middlewares');
const { deleteUser } = require('../db/user');

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

module.exports = router;