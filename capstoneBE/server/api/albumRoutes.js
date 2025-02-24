const express = require('express');
const router = express.Router();

const { createAlbum, fetchAlbums, fetchAlbumById } = require('../db/album.js');

// base route and return for the api for albums

// /api/albums

// create and album by saving spotify information to database
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

// fetch all albums from database
router.get('/', async (req, res, next) => {
  try {
    const response = await fetchAlbums();
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

// fetch album by id from database
router.get('/:id', async (req, res, next) => {
  try {
    const response = await fetchAlbumById(req.params.id);
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
