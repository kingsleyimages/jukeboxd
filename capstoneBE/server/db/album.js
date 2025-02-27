const { client } = require("./index");
const uuid = require("uuid");
const { fetchReviewsByAlbumId } = require("./review");

const createAlbum = async (spotify_id, name, artist, image, spotifyUrl) => {
  try {
    const SQL = `
    INSERT INTO albums(id, spotify_id, name, artist, image, spotifyUrl) VALUES($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
    const response = await client.query(SQL, [
      uuid.v4(),
      spotify_id,
      name,
      artist,
      image,
      spotifyUrl,
    ]);
    return response.rows[0];
  } catch (error) {
    console.log(error);
  }
};

const fetchAlbums = async () => {
  try {
    const SQL = `
    SELECT * FROM albums ;
  `;
    const response = await client.query(SQL);
    console.log(response);
    return response.rows;
  } catch (error) {
    console.log(error);
  }
};

const fetchAlbumById = async (spotifyId) => {
  try {
    const SQL = `
      SELECT * 
      FROM albums 
      WHERE spotify_id = $1
    `;
    const { rows } = await client.query(SQL, [spotifyId]);

    if (rows.length === 0) {
      console.error("No album found with Spotify ID:", spotifyId);
      return null;
    }
    const album = rows[0];
    const albumReviews = await fetchReviewsByAlbumId(album.id);
    album.reviews = albumReviews;
    console.log("Album with all reviews:", album);

    return album;
  } catch (error) {
    console.error("Error fetching album and reviews:", error.message);
    throw error;
  }
};

//This function will fetch all albums that have a review attached to them
const fetchAlbumsWithReviews = async () => {
  try {
    const SQL = `
    SELECT * FROM albums
    INNER JOIN reviews ON albums.id = reviews.album_id
    `;
    const response = await client.query(SQL);
    return response.rows;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createAlbum, fetchAlbums, fetchAlbumById, fetchAlbumsWithReviews };
