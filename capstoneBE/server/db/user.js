const { client } = require("./index");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (username, email, password, role) => {
  console.log(username, email, password, role);
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
  if (
    !response.rows.length ||
    !(await bcrypt.compare(password, response.rows[0].password))
  ) {
    const error = new Error("not authoruized");
    error.status = 401;
    throw error;
  }
  const myToken = jwt.sign({ id: response.rows[0].id }, process.env.JWT_SECRET);
  console.log("authetication success, token generated");
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

module.exports = { createUser, authenticate, userExists };
