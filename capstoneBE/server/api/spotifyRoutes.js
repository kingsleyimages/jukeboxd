const express = require("express");
const router = express.Router();

router.post("/token", async (req, res, next) => {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        error: "Spotify credentials are not configured on the server",
      });
    }

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
    });

    const tokenData = await tokenResponse.json().catch(() => null);

    if (!tokenResponse.ok || !tokenData?.access_token) {
      return res.status(tokenResponse.status || 502).json({
        error:
          tokenData?.error_description ||
          tokenData?.error ||
          "Failed to fetch Spotify access token",
      });
    }

    res.status(200).json({
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
