const { pool } = require("./index");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (username, email, password, role) => {
  console.log(username, email, password, role);
  const SQL = `
    INSERT INTO users(id, username, email, password, role) VALUES($1, $2, $3, $4, $5) RETURNING *
  `;
  const response = await pool.query(SQL, [
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

  const response = await pool.query(SQL, [username]);
  if (
    !response.rows.length ||
    !(await bcrypt.compare(password, response.rows[0].password))
  ) {
    const error = new Error("not authorized");
    error.status = 401;
    throw error;
  }
  const myToken = jwt.sign({ id: response.rows[0].id }, process.env.JWT_SECRET);
  console.log("authentication success, token generated");
  return { token: myToken };
};

const userExists = async (username) => {
  try {
    const SQL = `SELECT id FROM users WHERE username = $1;`;
    const response = await pool.query(SQL, [username]);
    return response.rows.length > 0;
  } catch (err) {
    console.error("Error checking if user exists:", err.message);
    throw err;
  }
};

const getUserByUsername = async (username) => {
  try {
    const SQL = `SELECT * FROM users WHERE username = $1;`;
    const response = await pool.query(SQL, [username]);
    return response.rows[0];
  } catch (err) {
    console.error("Error fetching user by username:", err.message);
    throw err;
  }
};

module.exports = { createUser, authenticate, userExists, getUserByUsername };
