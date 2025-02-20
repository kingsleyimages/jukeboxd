const { client } = require('./index');
// const uuid = require('uuid');
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
  try {
    const SQL = `INSERT INTO reviews (id, album_id, user_id, rating, favorite, headline, review)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
    `;
    const { rows } = await client.query(SQL, [
      uuidv4(),
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

module.exports = { createReview };
