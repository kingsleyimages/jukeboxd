const { client } = require("./index");
const uuid = require("uuid");
const { fetchReviewsByAlbumId } = require("./review");

const createAlbum = async (
	spotify_id,
	name,
	artist,
	image,
	spotifyUrl
) => {
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

const markAlbumAsListened = async (user_id, album_id) => {
	try {
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

module.exports = {
	createAlbum,
	fetchAlbums,
	fetchAlbumById,
	createTracks,
	fetchTracksByAlbumId,
	markAlbumAsListened,
};
