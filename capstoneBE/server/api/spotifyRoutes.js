const express = require("express");
const router = express.Router();

const normalizeLimit = (rawLimit, fallback = 10, max = 10) => {
  const parsed = Number.parseInt(rawLimit, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, 1), max);
};

// Cache token in memory to avoid hammering the token endpoint
let _cachedToken = null;
let _tokenExpiresAt = 0;

const getSpotifyToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Spotify credentials not configured");

  // Return cached token if still valid (with 30-second buffer)
  if (_cachedToken && Date.now() < _tokenExpiresAt - 30_000) {
    return _cachedToken;
  }

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(),
  });
  const tokenData = await tokenResponse.json().catch(() => null);
  if (!tokenResponse.ok || !tokenData?.access_token) {
    throw new Error(tokenData?.error_description || "Failed to get Spotify token");
  }

  _cachedToken = tokenData.access_token;
  _tokenExpiresAt = Date.now() + (tokenData.expires_in ?? 3600) * 1000;
  return _cachedToken;
};

router.get("/new-releases", async (req, res, next) => {
  try {
    const token = await getSpotifyToken();
    const limit = normalizeLimit(req.query.limit, 10, 10);
    const params = new URLSearchParams({
      q: "tag:new",
      type: "album",
      limit: String(limit),
    });
    // Use search with tag:new — browse/new-releases requires elevated Spotify app permissions
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/search?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await spotifyRes.json().catch(() => null);
    if (!spotifyRes.ok) {
      return res.status(spotifyRes.status).json({ error: data?.error?.message || "Spotify error" });
    }
    // Normalize to the same shape as browse/new-releases so Discover.jsx needs no changes
    res.status(200).json({ albums: data.albums });
  } catch (error) {
    next(error);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const { q, type = "artist" } = req.query;
    const limit = normalizeLimit(req.query.limit, 10, 10);
    if (!q) return res.status(400).json({ error: "Missing query parameter 'q'" });
    const token = await getSpotifyToken();
    const params = new URLSearchParams({
      q,
      type,
      limit: String(limit),
    });
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/search?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await spotifyRes.json().catch(() => null);
    if (!spotifyRes.ok) {
      return res.status(spotifyRes.status).json({ error: data?.error?.message || "Spotify error" });
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/artists/:artistId/albums", async (req, res, next) => {
  try {
    const { artistId } = req.params;
    const { market = "US" } = req.query;
    const limit = normalizeLimit(req.query.limit, 10, 10);
    const token = await getSpotifyToken();
    const params = new URLSearchParams({
      include_groups: "album",
      market,
      limit: String(limit),
    });
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/albums?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await spotifyRes.json().catch(() => null);
    if (!spotifyRes.ok) {
      return res.status(spotifyRes.status).json({ error: data?.error?.message || "Spotify error" });
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/albums/:albumId", async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const token = await getSpotifyToken();
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/albums/${albumId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await spotifyRes.json().catch(() => null);
    if (!spotifyRes.ok) {
      return res.status(spotifyRes.status).json({ error: data?.error?.message || "Spotify error" });
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/token", async (req, res, next) => {
  try {
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      return res.status(500).json({ error: "Spotify credentials are not configured on the server" });
    }
    const access_token = await getSpotifyToken();
    res.status(200).json({ access_token, token_type: "Bearer", expires_in: 3600 });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
