const { client } = require('./index');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const pool = new Pool();

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

const getUserByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
};

module.exports = { createUser, getUserByUsername };
