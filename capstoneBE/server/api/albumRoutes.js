const express = require("express");
const router = express.Router();

const {
  createAlbum,
  fetchAlbums,
  fetchAlbumById,
  createTracks,
  fetchTracksByAlbumId,
} = require("../db/album.js");

// base route and return for the api for albums

// /api/albums

// create and album by saving spotify information to database
router.post("/create", async (req, res, next) => {
  const { spotify_id, name, artist, image, spotifyUrl, tracks } = req.body;
  console.log("tracks", tracks);
  try {
    const response = await createAlbum(
      spotify_id,
      name,
      artist,
      image,
      spotifyUrl,
      tracks
    );

    const trackResponse = tracks.map(async (track) => {
      await createTracks(response.id, track);
    });
    await Promise.all(trackResponse);

    const albumResponse = await fetchAlbumById(response.id);
    res.status(201).send(albumResponse);
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
router.get("/", async (req, res, next) => {
  try {
    const response = await fetchAlbums();
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

// fetch album by id from database
router.get("/:id", async (req, res, next) => {
  try {
    const response = await fetchAlbumById(req.params.id);
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

//fetch all tracks for an album
router.get("/albums/:albumId/tracks", async (req, res, next) => {
  try {
    const albumId = req.params.albumId;
    const tracks = await fetchTracksByAlbumId(albumId);
    res.status(200).send(tracks);
  } catch (error) {
    console.error("Error fetching tracks for album:", error);
    next(error);
  }
});

module.exports = router;