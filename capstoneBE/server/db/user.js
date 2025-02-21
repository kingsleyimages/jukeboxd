const { client } = require("./index");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const createUser = async (username, password, role) => {
  console.log(username, password, role);
  const SQL = `
    INSERT INTO users(id, username, password, role) VALUES($1, $2, $3, $4) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    await bcrypt.hash(password, 5),
    role,
  ]);
  return response.rows[0];
};
module.exports = { createUser };
