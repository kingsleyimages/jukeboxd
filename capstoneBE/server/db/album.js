const { client } = require("./index");
const uuid = require("uuid");
const { fetchReviewsByAlbumId } = require("./review");

const createAlbum = async (spotify_id, name, artist, image, spotifyUrl, listened = false) => {
  try {
    const SQL = `
    INSERT INTO albums(id, spotify_id, name, artist, image, spotifyUrl, listened) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *;
  `;
    const response = await client.query(SQL, [
      uuid.v4(),
      spotify_id,
      name,
      artist,
      image,
      spotifyUrl,
      listened
    ]);
    return response.rows[0];
  } catch (error) {
    console.log(error);
  }
};

const createTracks = async (albumId, track) => {
  try {
    const SQL = `
    INSERT INTO tracks(id, title, spotify_id, album_id) VALUES($1, $2, $3, $4) RETURNING *;`;
    const response = await client.query(SQL, [
      uuid.v4(),
      track.title,
      track.spotify_id,
      albumId,
    ]);
    return response.rows;
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
    const albumTracks = await fetchTracksByAlbumId(album.id);
    album.reviews = albumReviews;
    album.tracks = albumTracks;
    console.log("Album with all reviews:", album);

    return album;
  } catch (error) {
    console.error("Error fetching album and reviews:", error.message);
    throw error;
  }
};

//fetch tracks by album id
const fetchTracksByAlbumId = async (album_id) => {
  try {
    const { rows } = await client.query(
      `
       SELECT * FROM tracks WHERE album_id=$1;
    `,
      [album_id]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
};

//This function will fetch all albums that have a review attached to them
const fetchAlbumsWithReviews = async () => {
  try {
    const SQL = `
    SELECT albums.*, reviews.id AS review_id, reviews.rating, reviews.favorite, reviews.headline, reviews.review, reviews.created_at AS review_created_at, reviews.updated_at AS review_updated_at
    FROM albums
    LEFT JOIN reviews ON albums.id = reviews.album_id
    `;
    const response = await client.query(SQL);
    console.log("Fetched albums with reviews:", response.rows); // Add logging

    // Group reviews by album
    const albumsMap = new Map();
    response.rows.forEach(row => {
      if (!albumsMap.has(row.id)) {
        albumsMap.set(row.id, {
          ...row,
          reviews: []
        });
      }
      if (row.review_id) {
        albumsMap.get(row.id).reviews.push({
          review_id: row.review_id,
          rating: row.rating,
          favorite: row.favorite,
          headline: row.headline,
          review: row.review,
          review_created_at: row.review_created_at,
          review_updated_at: row.review_updated_at
        });
      }
    });

    // Convert the map to an array and filter out albums with no reviews
    const albums = Array.from(albumsMap.values()).filter(album => album.reviews.length > 0);
    console.log("Processed albums with reviews:", albums); // Add logging
    return albums;
  } catch (error) {
    console.log("Error fetching albums with reviews:", error);
    throw error;
  }
};



module.exports = {
  createAlbum,
  fetchAlbums,
  fetchAlbumById,
  fetchAlbumsWithReviews,
  createTracks,
  fetchTracksByAlbumId,
  updateAlbumListenedStatus, // Add this line
};