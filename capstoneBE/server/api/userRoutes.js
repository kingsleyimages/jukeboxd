require("dotenv").config();
const express = require("express");
const router = express.Router();
const { client } = require("../db/index.js");

const { createUser, authenticate, userExists, getAllUsers, getAllComments, getAllReviews } = require("../db/user.js");
const { authenticateToken, adminAuth } = require("./middlewares");

// Register
router.post("/register", async (req, res, next) => {
  console.log("Received data:", req.body);
  try {
    const { username, email, password, role } = req.body;
    console.log("username:", username);
    console.log("email:", email);
    console.log("password:", password);
    console.log("role:", role);

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
router.post("/login", async (req, res, next) => {
  console.log("POST /login route hit");
  const { username, password } = req.body;
  console.log("login request received", req.body);
  try {
    const userFound = await userExists(username);
    if (!userFound) {
      return res.status(404).send("username not found");
    }
    const { token } = await authenticate({ username, password });
    res.json({ token, username });
  } catch (err) {
    console.error("authentication error", err.message);
    res.status(401).send("invalid details");
  }
});

// Get current user
router.get("/me", authenticateToken, async (req, res, next) => {
  try {
    console.log("authenticated user", req.user);
    const SQL = `SELECT id, username FROM users WHERE id = $1;`;
    const user = await client.query(SQL, [req.user.id]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error("error fetching user", err.message);
    res.status(500).send("unable to get info");
  }
});

// Get all users, comments, and reviews (admin only)
router.get("/admin/data", authenticateToken, adminAuth, async (req, res, next) => {
  try {
    const users = await getAllUsers();
    const comments = await getAllComments();
    const reviews = await getAllReviews();
    res.json({ users, comments, reviews });
  } catch (err) {
    console.error("error fetching data", err.message);
    res.status(500).send("unable to get data");
  }
});

module.exports = router;