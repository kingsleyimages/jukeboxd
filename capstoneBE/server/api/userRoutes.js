require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { client } = require("../db/index.js");

const { createUser, authenticate, userExists } = require("../db/user.js");

//middleware to verify JWT token

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).send("Access denied");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("invalid token");
    req.user = user;
    next();
  });
};

//register
router.post("/register", async (req, res, next) => {
  console.log(req.body);
  try {
    const response = await createUser(
      req.body.username,
      req.body.email,
      req.body.password,
      req.body.role
    );

    res.status(201).send(response);
  } catch (error) {
    next(error);
  }
});

//login
router.post("/login", async (req, res, next) => {
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

//get current user
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

module.exports = router;
