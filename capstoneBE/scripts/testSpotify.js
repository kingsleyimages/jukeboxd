require("dotenv").config();

const id = process.env.SPOTIFY_CLIENT_ID;
const secret = process.env.SPOTIFY_CLIENT_SECRET;

console.log("SPOTIFY_CLIENT_ID set:", !!id, "| value starts:", id?.slice(0, 6));
console.log("SPOTIFY_CLIENT_SECRET set:", !!secret, "| value starts:", secret?.slice(0, 6));

(async () => {
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: id,
      client_secret: secret,
    }).toString(),
  });

  const tokenText = await tokenRes.text();
  console.log("Token status:", tokenRes.status);
  console.log("Token response:", tokenText.slice(0, 300));

  if (tokenRes.status !== 200) return;

  const { access_token } = JSON.parse(tokenText);
  const apiRes = await fetch(
    "https://api.spotify.com/v1/browse/new-releases?limit=1",
    { headers: { Authorization: `Bearer ${access_token}` } }
  );
  const apiText = await apiRes.text();
  console.log("API status:", apiRes.status);
  console.log("API response:", apiText.slice(0, 300));
})();
