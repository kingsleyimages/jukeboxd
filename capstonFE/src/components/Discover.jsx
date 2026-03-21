import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/Discover.module.css";

function Discover() {
  const [albums, setAlbums] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_PROD ||
    import.meta.env.VITE_API_BASE_URL_DEV;

  const loadLocalAlbums = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/albums`);
      const data = await response.json().catch(() => []);
      if (response.ok && Array.isArray(data) && data.length > 0) {
        setAlbums(data);
      }
    } catch (error) {
      console.error("Failed to load local albums:", error);
    }
  };

  useEffect(() => {
    async function getTopAlbums() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/spotify/new-releases?limit=50`
        );
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          setErrorMessage(
            `Spotify error: ${
              data?.error || "Unable to load new releases."
            } Showing local albums instead.`
          );
          await loadLocalAlbums();
          return;
        }

        if (!data?.albums?.items) {
          throw new Error("Invalid data format received from Spotify API");
        }

        setAlbums(data.albums.items);
        setErrorMessage("");
      } catch (error) {
        console.error("Failed to fetch top albums!:", error);
        await loadLocalAlbums();
      }
    }

    getTopAlbums();
  }, []);

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
        `${API_BASE_URL}/api/spotify/albums/${albumId}`
      );

      if (!spotifyResponse.ok) {
        throw new Error("Failed to fetch album from Spotify");
      }

      const spotifyResult = await spotifyResponse.json().catch(() => null);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(albumData),
      });

      if (!saveResponse.ok) {
        throw new Error("failed to save album to local db");
      }

      navigate(`/album/${albumId}`);
    } catch (error) {
      console.error("Error handling album details:", error);
    }
  };
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
        {errorMessage && <p>{errorMessage}</p>}
        {albums.length > 0 ? (
          albums.map((album) => (
            <div key={album.id} className={styles.albumCard}>
              {/* <p>ID: {album.id}</p> */}
              <h3>{album.name}</h3>
              <img
                src={album.images?.[0]?.url || album.image}
                alt={album.name}
                width={200}
              />

              <h4>{album.artists?.[0]?.name || album.artist}</h4>
              <div>
                <button
                  className={styles.button}
                  onClick={() => handleViewDetails(album.spotify_id || album.id)}
                >
                  View Details
                </button>
                <a
                  href={album.external_urls?.spotify || album.spotifyurl || album.spotifyUrl}
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
