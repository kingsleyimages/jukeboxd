require("dotenv").config();
const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;

(async () => {
  const t = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: id,
      client_secret: secret,
    }),
  });
  const { access_token } = await t.json();

  const endpoints = [
    "https://api.spotify.com/v1/search?q=tag:new&type=album&limit=5",
    "https://api.spotify.com/v1/search?q=year:2026&type=album&limit=5",
    "https://api.spotify.com/v1/browse/new-releases?limit=5",
    "https://api.spotify.com/v1/browse/featured-playlists?limit=5",
  ];

  for (const url of endpoints) {
    const r = await fetch(url, {
      headers: { Authorization: "Bearer " + access_token },
    });
    const j = await r.json().catch(() => null);
    const key = url.split("/v1/")[1].split("?")[0];
    const info =
      j?.error?.message || Object.keys(j || {}).slice(0, 3).join(",");
    console.log(r.status, key, info);
  }
})();
