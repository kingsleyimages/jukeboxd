import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/Discover.module.css";

function Discover() {
  const [albums, setAlbums] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_PROD ||
    import.meta.env.VITE_API_BASE_URL_DEV;

  useEffect(() => {
    async function fetchAccessToken() {
      const clientId = import.meta.env.VITE_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        console.error("Missing Spotify API credentials. Check your .env file.");
        return;
      }

      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
          },
          body: "grant_type=client_credentials",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            `Error fetching access token: ${
              data.error_description || "Unknown error"
            }`
          );
        }

        setAccessToken(data.access_token);
      } catch (error) {
        console.error("Failed to fetch access token:", error);
      }
    }

    fetchAccessToken();
  }, []);

  useEffect(() => {
    async function sendAlbumsToDatabase(albums) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/albums/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(albums),
        });
        if (!response) {
          throw new Error("Failed to save albums to database");
        }
        console.log("Saved albums to database");
      } catch (error) {
        console.error("Error sending albums to database: ", error);
      }
    }

    async function getTopAlbums() {
      if (!accessToken) return;

      try {
        const response = await fetch(
          // "https://jukeboxd-znlr.onrender.com/api/albums",
          "https://api.spotify.com/v1/browse/new-releases?limit=50",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            `Error fetching albums: ${data.error?.message || "Unknown error"}`
          );
        }

        if (!data.albums || !data.albums.items) {
          throw new Error("Invalid data format received from Spotify API");
        }

        setAlbums(data.albums.items);

      } catch (error) {
        console.error("Failed to fetch top albums!:", error);
      }
    }

    getTopAlbums();
  }, [accessToken]);

  const handleViewDetails = async (albumId) => {
    try {
      const localResponse = await fetch(
        `${API_BASE_URL}/api/albums/${albumId}`
      );
      const localResult = await localResponse.json().catch(() => null);
      if (localResult?.id) {
        navigate(`/album/${albumId}`);
        return;
      }

      const spotifyResponse = await fetch(
        `https://api.spotify.com/v1/albums/${albumId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!spotifyResponse.ok) {
        throw new Error("Failed to fetch album from Spotify");
      }

      const spotifyResult = await spotifyResponse.json().catch(() => null);
      console.log("spotify result", spotifyResult);

      const albumData = {
        name: spotifyResult.name,
        artist: spotifyResult.artists[0]?.name || "unknown artist",
        image: spotifyResult.images[0]?.url || "",
        spotify_id: spotifyResult.id,
        spotifyUrl: spotifyResult.external_urls?.spotify,
        tracks: spotifyResult.tracks.items.map((track) => ({
          title: track.name,
          spotify_id: track.id,
          track_number: track.track_number,
        })),
      };

      const saveResponse = await fetch(`${API_BASE_URL}/api/albums/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(albumData),
      });

      if (!saveResponse.ok) {
        throw new Error("failed to save album to local db");
      }
      console.log("album saved to local db");

      navigate(`/album/${albumId}`);
    } catch (error) {
      console.error("Error handling album details:", error);
    }
  };
  console.log(albums);
  return (
    <>
      <h1 className={styles.pageHeader}>
        Share Your Love of Music on Jukeboxd!
      </h1>
      <p className={styles.tagLine}>
        Welcome to <span>Jukeboxd</span>, the ultimate destination for music
        lovers who crave deep discussions, insightful reviews, and a community
        that shares their passion for sound. Whether you're exploring new
        genres, debating the best pressings of classic albums, or searching for
        hidden gems, this is the place to connect with fellow audiophiles. Share
        your own reviews, rate albums, and discover music through the
        perspectives of others who appreciate high-quality sound as much as you
        do. Join us in celebrating the art of music—one review at a time!
      </p>
      <div className={styles.container}>
        {albums.length > 0 ? (
          albums.map((album) => (
            <div key={album.id} className={styles.albumCard}>
              {/* <p>ID: {album.id}</p> */}
              <h3>{album.name}</h3>
              <img src={album.images[0].url} alt={album.name} width={200} />

              <h4>{album.artists[0].name}</h4>
              <div>
                <button
                  className={styles.button}
                  onClick={() => handleViewDetails(album.id)}
                >
                  View Details
                </button>
                <a
                  href={album.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Listen on Spotify
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>Loading albums...</p>
        )}
      </div>
    </>
  );
}

export default Discover;
