const { client } = require('./index');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (username, email, password, role) => {
  if (!password) throw new Error('Password is required');
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

const deleteUser = async (id) => {
  const SQL = `DELETE FROM users WHERE id = $1 RETURNING *;`;
  const { rows } = await client.query(SQL, [id]);
  return rows[0];
};

const authenticate = async ({ username, password }) => {
  const SQL = `SELECT id, password, email, role FROM users WHERE username = $1;`;
  const response = await client.query(SQL, [username]);

  if (!response.rows.length) throw new Error('User not found');
  const user = response.rows[0];
  if (!user.password) throw new Error('User password not defined');

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new Error('Incorrect password');

  const myToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET
  );
  return { token: myToken };
};

const userExists = async (username) => {
  const SQL = `SELECT id FROM users WHERE username = $1;`;
  const response = await client.query(SQL, [username]);
  return response.rows.length > 0;
};
const modifyUser2 = async (id, username, email, password) => {
  const SQL = `UPDATE users SET username = $2, email = $3, password = $4 WHERE id = $1 RETURNING *;`;
  const response = await client.query(SQL, [id, username, email, password]);
  return response.rows[0];
};

const modifyUser = async (id, username, email, role) => {
  const SQL = `UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4 RETURNING *;`;
  const response = await client.query(SQL, [username, email, role, id]);
  return response.rows[0];
};

const fetchUserById = async (id) => {
  const SQL = `SELECT id, username, email, role FROM users WHERE id = $1;`;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
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

module.exports = {
  createUser,
  deleteUser,
  modifyUser,
  authenticate,
  userExists,
  getAllUsers,
  getAllComments,
  getAllReviews,
  fetchUserById,
  modifyUser2,
};
