const { client } = require('./index');
const uuid = require('uuid');

// create a unique friend relationship between two users
const createFriend = async (userId, friendId) => {
  console.log(userId, friendId);
  try {
    const SQL = `INSERT INTO friends (id, user_id, friend_id)
    VALUES ($1, $2, $3)
    RETURNING *;
    
    `;
    const { rows } = await client.query(SQL, [uuid.v4(), userId, friendId]);
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};

// get all friend relationships

const fetchAllFriends = async () => {
  try {
    const { rows } = await client.query(
      `
      SELECT u1.username AS user, u2.username AS friend
      FROM friends
      INNER JOIN users u1 ON friends.user_id = u1.id
      INNER JOIN users u2 ON friends.friend_id = u2.id
    `
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
};

// get all friends of a user

// get all friends of a user
const fetchFriendsById = async (userId) => {
  try {
    const { rows } = await client.query(
      `
      SELECT users.username FROM users
      INNER JOIN friends ON users.id = friends.friend_id
      WHERE friends.user_id = $1
      UNION
      SELECT users.username FROM users
      INNER JOIN friends ON users.id = friends.user_id
      WHERE friends.friend_id = $1
    `,
      [userId]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const deleteFriend = async (userId, friendId) => {
  try {
    const SQL = `DELETE FROM friends WHERE user_id = $1 OR friend_id = $1`;
    const { rows } = await client.query(SQL, [userId, friendId]);
    return rows;
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  createFriend,
  fetchAllFriends,
  fetchFriendsById,
  deleteFriend,
};
