const { client } = require("./index");
const uuid = require("uuid");
// const bcrypt = require('bcrypt');

// create a review for an album
const createReview = async (
  albumId,
  userId,
  review,
  headline,
  rating,
  favorite
) => {
  console.log("DB generation of review");
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
//fetch all reviews

const fetchReviews = async () => {
  try {
    const { rows } = await client.query(
      `
      SELECT users.username, review, rating, favorite, headline
      FROM reviews
      INNER JOIN users
      ON reviews.user_id = users.id
    `
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
};

// fetch all reviews for an album
// const fetchReviewsByAlbumId = async (id) => {
//   try {
//     const { rows } = await client.query(
//       `
//       SELECT * FROM reviews
//       WHERE album_id = $1
//     `,
//       [id]
//     );
//     return rows[0];
//   } catch (error) {
//     console.log(error);
//   }
// };

// Updated fetchReviewsByAlbumId function with JOIN to include usernames
const fetchReviewsByAlbumId = async (id) => {
  try {
    const { rows } = await client.query(
      `
      SELECT users.username, review, rating, favorite, headline
      FROM reviews
      INNER JOIN users
      ON reviews.user_id = users.id
      WHERE album_id = $1
    `,
      [id]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
};

// fetch all reviews by a user
const fetchReviewsByUserId = async (id) => {
  try {
    const { rows } = await client.query(
      `
      SELECT users.username, review, rating favorite, headline
      FROM reviews
      INNER JOIN users
      ON reviews.user_id = users.id
      WHERE user_id = $1
    `,
      [id]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
};
// delete a review by id
const deleteReview = async (id) => {
  try {
    const { rows } = await client.query(
      `
      DELETE FROM reviews
      WHERE id = $1
      RETURNING *;
    `,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};

//update a review by id

const updateReview = async (id, review, headline, rating, favorite) => {
  try {
    const { rows } = await client.query(
      `
      UPDATE reviews
      SET review = $2, headline= $3, rating = $4, favorite = $5,
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `,
      [id, review, headline, rating, favorite]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  createReview,
  fetchReviewsByAlbumId,
  fetchReviewsByUserId,
  fetchReviews,
  deleteReview,
  updateReview,
};
