const { client } = require('./index');
const uuid = require('uuid');

const createComment = async (reviewId, userId, comment) => {
  console.log('DB generation of Comments');
  console.log(userId, reviewId, comment);
  try {
    const SQL = `INSERT INTO comments (id, user_id, review_id, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `;
    const { rows } = await client.query(SQL, [
      uuid.v4(),
      userId,
      reviewId,
      comment,
    ]);
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};

const fetchCommentsByReviewId = async (id) => {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM comments
      WHERE review_id = $1
    `,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};
const fetchCommentsByUserId = async (id) => {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM comments
      WHERE user_id = $1
    `,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createComment,
  fetchCommentsByReviewId,
  fetchCommentsByUserId,
};
