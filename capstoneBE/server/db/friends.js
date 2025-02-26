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
// fetch all friends that are not already friends with the user
const fetchAvailableFriends = async (userId) => {
  try {
    const { rows } = await client.query(
      `
      SELECT u.username, u.id
      FROM users u
      LEFT JOIN friends f1 ON u.id = f1.friend_id AND f1.user_id = $1
      LEFT JOIN friends f2 ON u.id = f2.user_id AND f2.friend_id = $1
      WHERE f1.friend_id IS NULL AND f2.user_id IS NULL AND u.id != $1;
    `,
      [userId]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
};

// get all friends of a user
const fetchFriendsById = async (userId) => {
  try {
    const { rows } = await client.query(
      `
      SELECT users.username, users.id FROM users
      INNER JOIN friends ON users.id = friends.friend_id
      WHERE friends.user_id = $1
      UNION
      SELECT users.username, users.id FROM users
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

// get all reviews by friends of a user

const fetchReviewsByFriends = async (userId) => {
  try {
    const { rows } = await client.query(
      `
      SELECT reviews.review, reviews.headline, reviews.rating, reviews.favorite, users.username
FROM reviews
INNER JOIN users ON reviews.user_id = users.id
WHERE reviews.user_id IN (
  SELECT friend_id FROM friends WHERE user_id = $1
  UNION
  SELECT user_id FROM friends WHERE friend_id = $1
)
      `,
      [userId]
    );
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteFriend = async (userId, friendId) => {
  try {
    const SQL = `DELETE FROM friends WHERE (user_id = $1 and friend_id = $2) OR (user_id = $2 and friend_id = $1)`;
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
  fetchReviewsByFriends,
  fetchAvailableFriends,
};
