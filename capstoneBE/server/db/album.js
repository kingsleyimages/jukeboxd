const { client } = require("./index");
const uuid = require("uuid");

const createAlbum = async (spotify_id, name, artist, image, spotifyUrl) => {
  try {
    const SQL = `
    INSERT INTO albums(id, spotify_id, name, artist, image, spotifyUrl) VALUES($1, $2, $3, $4, $5, $6) RETURNING *
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

const fetchAlbumById = async (id) => {
  const SQL = `
    SELECT * FROM albums WHERE spotify_id = $1
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

module.exports = { createAlbum, fetchAlbums, fetchAlbumById };
