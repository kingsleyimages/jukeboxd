require('dotenv').config();
const express = require('express');
const router = express.Router();
const { client } = require('../db/index.js');

const {
  createUser,
  authenticate,
  userExists,
} = require('../db/user.js');
const { authenticateToken } = require('./middlewares.js');

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
  console.log('Login route hit');
  try {
    const { username, password } = req.body;
    console.log('Username:', username);
    console.log('Password:', password);

    const userFound = await userExists(username);
    console.log('User found:', userFound);

    if (!userFound) {
      console.log('Username not found');
      return res.status(404).send({ error: 'Username not found' });
    }

    const { token } = await authenticate({ username, password });
    console.log('Token generated:', token);

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

router.put('/:id/edit', authenticateToken, async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const response = await modifyUser2(
      req.params.id,
      username,
      email,
      password
    );
    res.status(200).send(response);
  } catch (err) {
    console.error('error modifying user', err.message);
    res.status(500).send('unable to modify user');
  }
});




module.exports = router;
