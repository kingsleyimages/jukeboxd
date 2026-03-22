const express = require("express");
const axios = require("axios");
const router = express.Router();

const normalizeLimit = (rawLimit, fallback = 20, max = 20) => {
  const parsed = Number.parseInt(rawLimit, 20);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, 1), max);
};

const normalizeOffset = (rawOffset, fallback = 0, max = 1000) => {
  const parsed = Number.parseInt(rawOffset, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, 0), max);
};

// Cache token in memory to avoid hammering the token endpoint
let _cachedToken = null;
let _tokenExpiresAt = 0;

const getSpotifyToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    const error = new Error("Spotify credentials not configured on server");
    error.status = 500;
    throw error;
  }

  // Return cached token if still valid (with 30-second buffer)
  if (_cachedToken && Date.now() < _tokenExpiresAt - 30_000) {
    return _cachedToken;
  }

  const tokenResponse = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 10_000,
    },
  );
  const tokenData = tokenResponse?.data;
  if (!tokenData?.access_token) {
    const error = new Error("Failed to get Spotify token");
    error.status = 502;
    throw error;
  }

  _cachedToken = tokenData.access_token;
  _tokenExpiresAt = Date.now() + (tokenData.expires_in ?? 3600) * 1000;
  return _cachedToken;
};

const sendSpotifyError = (error, res) => {
  const status = error?.response?.status || error?.status || 500;
  const message =
    error?.response?.data?.error?.message ||
    error?.response?.data?.error_description ||
    error?.message ||
    "Spotify error";

  return res.status(status).json({ error: message });
};

router.get("/new-releases", async (req, res, next) => {
  try {
    const token = await getSpotifyToken();
    const limit = normalizeLimit(req.query.limit, 20, 20);
    const randomOffset = Math.floor(Math.random() * 200);
    const offset = normalizeOffset(req.query.offset, randomOffset, 1000);
    const params = {
      q: "tag:new",
      market: "US",
      type: "album",
      limit,
      offset,
    };
    // Use search with tag:new — browse/new-releases requires elevated Spotify app permissions
    const spotifyRes = await axios.get("https://api.spotify.com/v1/search", {
      params,
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10_000,
    });
    const data = spotifyRes.data;
    // Normalize to the same shape as browse/new-releases so Discover.jsx needs no changes
    res.status(200).json({ albums: data.albums });
  } catch (error) {
    return sendSpotifyError(error, res);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const { q, type = "artist" } = req.query;
    const limit = normalizeLimit(req.query.limit, 20, 20);
    if (!q)
      return res.status(400).json({ error: "Missing query parameter 'q'" });
    const token = await getSpotifyToken();
    const params = {
      q,
      type,
      limit,
    };
    const spotifyRes = await axios.get("https://api.spotify.com/v1/search", {
      params,
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10_000,
    });
    const data = spotifyRes.data;
    res.status(200).json(data);
  } catch (error) {
    return sendSpotifyError(error, res);
  }
});

router.get("/artists/:artistId/albums", async (req, res, next) => {
  try {
    const { artistId } = req.params;
    const { market = "US" } = req.query;
    const limit = normalizeLimit(req.query.limit, 10, 10);
    const token = await getSpotifyToken();
    const params = {
      include_groups: "album",
      market,
      limit,
    };
    const spotifyRes = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/albums`,
      {
        params,
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10_000,
      },
    );
    const data = spotifyRes.data;
    res.status(200).json(data);
  } catch (error) {
    return sendSpotifyError(error, res);
  }
});

router.get("/albums/:albumId", async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const token = await getSpotifyToken();
    const spotifyRes = await axios.get(
      `https://api.spotify.com/v1/albums/${albumId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10_000,
      },
    );
    const data = spotifyRes.data;
    res.status(200).json(data);
  } catch (error) {
    return sendSpotifyError(error, res);
  }
});

router.post("/token", async (req, res, next) => {
  try {
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      return res.status(500).json({
        error: "Spotify credentials are not configured on the server",
      });
    }
    const access_token = await getSpotifyToken();
    res
      .status(200)
      .json({ access_token, token_type: "Bearer", expires_in: 3600 });
  } catch (error) {
    return sendSpotifyError(error, res);
  }
});

module.exports = router;
