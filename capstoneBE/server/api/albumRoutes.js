const express = require('express');
const router = express.Router();
const { fetchAlbumsWithReviews, fetchAlbums, fetchAlbumById, createAlbum } = require('../db/album');

// base route and return for the api for albums

// /api/albums

// create an album by saving Spotify information to the database
router.post('/create', async (req, res, next) => {
  const { spotify_id, name, artist, image, spotifyUrl } = req.body;
  try {
    const response = await createAlbum(
      spotify_id,
      name,
      artist,
      image,
      spotifyUrl
    );
    res.status(201).send(response);
  } catch (error) {
    next(error);
  }
});

// fetch all albums with reviews
router.get('/reviewed', async (req, res, next) => {
  try {
    console.log("API route accessed: /albums/reviewed");
    const albums = await fetchAlbumsWithReviews();
    console.log("Albums with reviews:", albums); // Add logging
    res.json(albums);
  } catch (error) {
    console.error("Error fetching albums with reviews:", error);
    res.status(500).json({ error: "An error occurred while fetching albums with reviews" });
  }
});

// fetch all albums from the database
router.get('/', async (req, res, next) => {
  try {
    const response = await fetchAlbums();
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

// fetch album by id from the database
router.get('/:id', async (req, res, next) => {
  try {
    const response = await fetchAlbumById(req.params.id);
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;