const { get } = require("../api");
const { client } = require("./index");
const uuid = require("uuid");

const createReview = async (
  spotifyAlbumId,
  userId,
  review,
  headline,
  rating,
  favorite
) => {
  console.log("DB generation of review");
  try {
    const albumId = await getAlbumIdBySpotifyId(spotifyAlbumId);
    if (!albumId) {
      console.error("invalid spotify id or album not found");
    }

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

const fetchReviewsDesc = async () => {
  try {
    const { rows } = await client.query(
      `
      SELECT users.username, review, rating, favorite, headline, TO_CHAR(reviews.updated_at, 'MM/DD/YYYY') AS updated_at, albums.name AS album_name, albums.image AS album_image, albums.artist AS album_artist, albums.spotify_id AS album_spotify_id
      FROM reviews
      INNER JOIN users
      ON reviews.user_id = users.id
      INNER JOIN albums
      ON reviews.album_id = albums.id
      ORDER BY reviews.created_at DESC
      LIMIT 20
    `
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const fetchReviewsByAlbumId = async (id) => {
  console.log(id);
  try {
    const { rows } = await client.query(
      `
        SELECT r.*, u.username
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.album_id = $1
      ORDER BY r.created_at DESC;
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
    console.log(`Fetching reviews for user ID: ${id}`);
    const { rows } = await client.query(
      `
      SELECT 
  reviews.id, 
  users.username, 
  reviews.review, 
  reviews.rating, 
  reviews.favorite, 
  reviews.headline, 
  albums.spotify_id AS album_spotify_id,
  albums.name AS album_name, 
  albums.image AS album_image
FROM 
  reviews
INNER JOIN 
  users ON reviews.user_id = users.id
INNER JOIN 
  albums ON reviews.album_id = albums.id
WHERE 
  reviews.user_id = $1;
    `,
      [id]
    );
    console.log(`Fetched reviews for user ID: ${id}`, rows);
    return rows;
  } catch (error) {
    console.error(`Error fetching reviews for user ID: ${id}`, error.message);
    throw error;
  }
};

const getReviewById = async (id) => {
  try {
    console.log("Executing query to fetch review with ID:", id); // Debugging log
    const { rows } = await client.query(
      `
      SELECT * FROM reviews
      WHERE id = $1
    `,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error fetching review by ID:", error);
    throw error;
  }
};

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

const getAlbumIdBySpotifyId = async (spotifyId) => {
  try {
    const { rows } = await client.query(
      `
      SELECT id FROM albums WHERE spotify_id = $1
    `,
      [spotifyId]
    );
    return rows[0]?.id;
  } catch (error) {
    console.error("Error fetching album UUID:", error.message);
  }
};

const getAllReviews = async () => {
  try {
    const { rows } = await client.query(`
      SELECT * FROM reviews
    `);
    return rows;
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
  }
};

const markAlbumAsListened = async (user_id, spotify_id) => {
  try {
    const albumQuery = "SELECT id FROM albums WHERE spotify_id = $1";
    const albumRes = await client.query(albumQuery, [spotify_id]);
    if (albumRes.rows.length === 0) {
      throw new Error(`Album with Spotify ID ${spotify_id} not found`);
    }
    const album_id = albumRes.rows[0].id;

    const SQL = `
        INSERT INTO listenedto (id, user_id, album_id, is_listened, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        ON CONFLICT (user_id, album_id) 
        DO UPDATE SET is_listened = TRUE, updated_at = NOW()
        RETURNING *;
      `;

    const response = await client.query(SQL, [
      uuid.v4(),
      user_id,
      album_id,
      true,
    ]);

    return response.rows[0];
  } catch (error) {
    console.error("Error marking album as listened:", error.message);
    throw error;
  }
};

const getlistenedto = async (user_id, spotify_id) => {
  try {
    // Validate user_id before querying the database
    if (!user_id || typeof user_id !== "string" || user_id.length !== 36) {
      throw new Error(`Invalid UUID provided: ${user_id}`);
    }

    // Fetch the album ID using the Spotify ID
    const albumQuery = "SELECT id FROM albums WHERE spotify_id = $1";
    const albumRes = await client.query(albumQuery, [spotify_id]);

    if (albumRes.rows.length === 0) {
      throw new Error(`Album with Spotify ID ${spotify_id} not found`);
    }

    const album_Id = albumRes.rows[0].id;

    // Query for listened-to status
    const listenedQuery = `
            SELECT * FROM listenedto 
            WHERE user_id = $1 AND album_id = $2 AND is_listened = true;
        `;

    const { rows } = await client.query(listenedQuery, [user_id, album_Id]);

    return rows;
  } catch (error) {
    console.error("Error in getlistenedto:", error);
    return []; // Return an empty array instead of undefined to prevent frontend errors
  }
};

const getalllistened = async (user_id) => {
  try {
    const SQL = `SELECT * FROM listenedto WHERE user_id = $1`;
    const { rows } = client.await(SQL, [user_id]);
    return rows;
  } catch (error) {
    console.error("Error in getalllistened", error);
    return [];
  }
};

// delete a review by id
const deleteReview = async (id) => {
  try {
    console.log(`Deleting review with ID: ${id}`);
    const { rows } = await client.query(
      `
      DELETE FROM reviews
      WHERE id = $1
      RETURNING *;
    `,
      [id]
    );
    console.log(`Deleted review with ID: ${id}`, rows[0]);
    return rows[0];
  } catch (error) {
    console.error(`Error deleting review with ID: ${id}`, error.message);
    throw error;
  }
};

const getUserReviews = async (userId) => {
  try {
    console.log(`Fetching reviews for user ID: ${userId}`);
    const { rows } = await client.query(
      `
      SELECT 
        reviews.id, 
        users.username, 
        reviews.review, 
        reviews.rating, 
        reviews.favorite, 
        reviews.headline, 
        albums.spotify_id AS album_spotify_id,
        albums.name AS album_name, 
        albums.image AS album_image
      FROM 
        reviews
      INNER JOIN 
        users ON reviews.user_id = users.id
      INNER JOIN 
        albums ON reviews.album_id = albums.id
      WHERE 
        reviews.user_id = $1;
      `,
      [userId]
    );
    console.log(`Fetched reviews for user ID: ${userId}`, rows);
    return rows;
  } catch (error) {
    console.error(`Error fetching user reviews for user ID: ${userId}`, error.message);
    throw error;
  }
};

module.exports = {
  createReview,
  fetchReviewsByAlbumId,
  fetchReviewsByUserId,
  fetchReviewsDesc,
  fetchReviews,
  deleteReview,
  updateReview,
  getReviewById,
  getAllReviews,
  markAlbumAsListened,
  getlistenedto,
  getalllistened,
  getUserReviews,
};