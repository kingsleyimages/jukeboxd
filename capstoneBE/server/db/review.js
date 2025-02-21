const { client } = require('./index');
const uuid = require('uuid');
// const bcrypt = require('bcrypt');

const createReview = async (
  albumId,
  userId,
  review,
  headline,
  rating,
  favorite
) => {
  console.log('DB generation of review');
  console.log(albumId, userId, review, headline, rating, favorite);
  try {
    const SQL = `INSERT INTO reviews (id, album_id, user_id, rating, favorite, headline, review)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
    `;
    const { rows } = await client.query(SQL, [
      uuid.v4(),
      albumId,
      userId,
      rating,
      favorite,
      headline,
      review,
    ]);
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};

const fetchReviewsByAlbumId = async (id) => {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM reviews
      WHERE album_id = $1
    `,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};
const fetchReviewsByUserId = async (id) => {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM reviews
      WHERE user_id = $1
    `,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createReview, fetchReviewsByAlbumId, fetchReviewsByUserId };
