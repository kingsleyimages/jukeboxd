require('dotenv').config();
const express = require('express');
const router = express.Router();
const { client } = require('../db/index.js');

const {
  createUser,
  authenticate,
  userExists,
  getAllUsers,
  getAllComments,
  getAllReviews,
  deleteUser,
  modifyUser,
  fetchUserById,
} = require('../db/user.js');
const { authenticateToken, adminAuth } = require('./middlewares.js');

// Register
router.post('/register', async (req, res, next) => {
  console.log('Received data:', req.body);
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
      throw new Error('All fields are required');
    }

    const response = await createUser(username, email, password, role);
    res.status(201).send(response);
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const userFound = await userExists(username);
    if (!userFound) {
      return res.status(404).send({ error: 'Username not found' });
    }
    const { token } = await authenticate({ username, password });
    res.json({ token, username });
  } catch (err) {
    console.error('Authentication error', err.message);
    res.status(401).send({ error: 'Invalid login details' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const SQL = `SELECT id, username, role FROM users WHERE id = $1;`;
    const user = await client.query(SQL, [req.user.id]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error('Error fetching user', err.message);
    res.status(500).send({ error: 'Unable to fetch user info' });
  }
});

// Get all users
router.get('/', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users', err.message);
    res.status(500).send({ error: 'Unable to fetch users' });
  }
});

// Fetch user by ID (admin only)
router.get('/:id', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    console.log(`Admin ${req.user.id} fetching user ID: ${req.params.id}`);
    const user = await fetchUserById(req.params.id);
    res.json(user);
  } catch (err) {
    console.error('Error fetching user by ID', err.message);
    res.status(500).send({ error: 'Unable to fetch user info' });
  }
});

// Get all users, comments, and reviews (admin only)
router.get('/admin/data', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const users = await getAllUsers();
    const comments = await getAllComments();
    const reviews = await getAllReviews();
    res.json({ users, comments, reviews });
  } catch (err) {
    console.error('Error fetching data', err.message);
    res.status(500).send({ error: 'Unable to fetch data' });
  }
});

// Modify user (admin only)
router.put('/admin/users/:id', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    console.log(`Admin ${req.user.id} modifying user ID: ${req.params.id}`);
    const { username, email, role } = req.body;
    const response = await modifyUser(req.params.id, username, email, role);
    res.status(200).send(response);
  } catch (err) {
    console.error('Error modifying user', err.message);
    res.status(500).send({ error: 'Unable to modify user' });
  }
});

// Delete user (admin only)
router.delete('/admin/users/:id', authenticateToken, adminAuth, async (req, res, next) => {
  try {
    console.log(`Admin ${req.user.id} deleting user ID: ${req.params.id}`);
    await deleteUser(req.params.id);
    res.status(200).send({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user', err.message);
    res.status(500).send({ error: 'Unable to delete user' });
  }
});

module.exports = router;
