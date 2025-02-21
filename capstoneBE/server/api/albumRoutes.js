const express = require('express');
const router = express.Router();

const { createAlbum, fetchAlbums, fetchAlbumById } = require('../db/album.js');

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

router.get('/', async (req, res, next) => {
  try {
    const response = await fetchAlbums();
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const response = await fetchAlbumById(req.params.id);
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
