const { client } = require("./index");
const uuid = require("uuid");

//get all favorite albums of a user

const fetchFavoritesByUser = async (userId) => {
  try {
    const { rows } = await client.query(
      `
      SELECT albums.spotify_id, albums.name, albums.artist, albums.image
      FROM albums
      INNER JOIN reviews ON albums.id = reviews.album_id
      WHERE reviews.user_id = $1 AND reviews.favorite = true
    `,
      [userId]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
};

// get users' friends' favorite albums
const fetchFriendFavorites = async (userId) => {
  try {
    const { rows } = await client.query(
      `
      SELECT albums.spotify_id, albums.name, albums.artist, albums.image, users.username
FROM albums
INNER JOIN reviews ON albums.id = reviews.album_id
INNER JOIN users ON reviews.user_id = users.id
WHERE reviews.user_id IN (
  SELECT friend_id FROM friends WHERE user_id = $1
  UNION
  SELECT user_id FROM friends WHERE friend_id = $1
)
AND reviews.favorite = true
    `,
      [userId]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { fetchFavoritesByUser, fetchFriendFavorites };
