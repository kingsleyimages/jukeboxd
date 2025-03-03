const { get } = require('../api/userRoutes');
const { client } = require('./index');
const uuid = require('uuid');

// create a comment
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

//fetch comment by id
const fetchCommentById = async (id) => {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM comments
      WHERE id = $1
    `,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};

// fetch all comments
const fetchComments = async () => {
  try {
    const { rows } = await client.query(
      `
      SELECT users.username, comments.comment
      FROM comments
      INNER JOIN users ON comments.user_id = users.id
    `
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
};

// fetch comments by review id
const fetchCommentsByReviewId = async (id) => {
  try {
    const { rows } = await client.query(
      `
      SELECT users.username, comments.comment
      FROM comments
      INNER JOIN users ON comments.user_id = users.id
      WHERE review_id = $1
    `,
      [id]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const fetchCommentsByUserId = async (id) => {
  try {
    const { rows } = await client.query(
      `
      SELECT comments.id, comments.comment, comments.user_id, comments.review_id, comments.created_at, comments.updated_at, users.username
      FROM comments
      INNER JOIN users ON comments.user_id = users.id
      WHERE comments.user_id = $1
    `,
      [id]
    );
    return rows.map(row => ({
      id: row.id,
      comment: row.comment,
      user_id: row.user_id,
      review_id: row.review_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      user: {
        id: row.user_id,
        username: row.username,
      },
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
};

// delete a comment
const deleteComment = async (id) => {
  try {
    const { rows } = await client.query(
      `
      DELETE FROM comments
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

// update a comment
const updateComment = async (id, comment) => {
  try {
    const { rows } = await client.query(
      `
      UPDATE comments
      SET comment = $2,
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `,
      [id, comment]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};


// Get all comments (admin only)
const getAllComments = async () => {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM comments;
    `
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createComment,
  fetchCommentById,
  fetchCommentsByReviewId,
  fetchCommentsByUserId,
  deleteComment,
  updateComment,
  fetchComments,
  getAllComments,
};
