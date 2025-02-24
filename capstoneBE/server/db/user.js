const { client } = require("./index");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (username, email, password, role) => {
  console.log(username, email, password, role);

  if (!password) {
    throw new Error("Password is required");
  }

  const SQL = `
    INSERT INTO users(id, username, email, password, role) VALUES($1, $2, $3, $4, $5) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    email,
    await bcrypt.hash(password, 5),
    role,
  ]);
  return response.rows[0];
};

const authenticate = async ({ username, password }) => {
  console.log("authenticating user:", username);
  const SQL = `
  SELECT id, password, email, role FROM users WHERE username = $1;`;

  const response = await client.query(SQL, [username]);
  if (!response.rows.length) {
    console.log("User not found");
    const error = new Error("not authorized");
    error.status = 401;
    throw error;
  }

  const user = response.rows[0];
  console.log("Retrieved user:", user);

  if (!user.password) {
    console.log("User password is undefined");
    const error = new Error("not authorized");
    error.status = 401;
    throw error;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    console.log("Password does not match");
    const error = new Error("not authorized");
    error.status = 401;
    throw error;
  }

  const myToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  console.log("authentication success, token generated");
  return { token: myToken };
};

const userExists = async (username) => {
  try {
    const SQL = `SELECT id FROM users WHERE username = $1;`;
    const response = await client.query(SQL, [username]);
    return response.rows.length > 0;
  } catch (err) {
    console.error("Error checking if user exists:", err.message);
    throw err;
  }
};


const getAllUsers = async () => {
  const SQL = `SELECT id, username, email, role FROM users;`;
  const response = await client.query(SQL);
  return response.rows;
};

const getAllComments = async () => {
  const SQL = `SELECT * FROM comments;`;
  const response = await client.query(SQL);
  return response.rows;
};

const getAllReviews = async () => {
  const SQL = `SELECT * FROM reviews;`;
  const response = await client.query(SQL);
  return response.rows;
};

module.exports = { createUser, authenticate, userExists, getAllUsers, getAllComments, getAllReviews };
