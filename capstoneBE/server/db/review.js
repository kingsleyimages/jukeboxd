const { client } = require('./index');
const uuid = require('uuid');

// create a review for an album
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

// fetch all reviews
const fetchReviews = async () => {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM reviews
    `
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
};

// fetch all reviews for an album
const fetchReviewsByAlbumId = async (id) => {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM reviews
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
      SELECT * FROM reviews
      WHERE user_id = $1
    `,
      [id]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
};

// fetch a review by id
const getReviewById = async (id) => {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM reviews
      WHERE id = $1
    `,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};

// delete a review by id
const deleteReview = async (reviewId) => {
  try {
    // Delete related comments first
    await client.query('DELETE FROM comments WHERE review_id = $1', [reviewId]);

    // Then delete the review
    const result = await client.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [reviewId]);
    if (result.rowCount === 0) {
      throw new Error('Review not found');
    }
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// update a review by id
const updateReview = async (id, review) => {
  try {
    const { rows } = await client.query(
      `
      UPDATE reviews
      SET review = $2,
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `,
      [id, review]
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
  getReviewById,
};