import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Container, Row, Card, Button } from "react-bootstrap";
import styles from "../css/Search.module.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL_PROD ||
  import.meta.env.VITE_API_BASE_URL_DEV;

function Results() {
  const { searchInput } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      if (!searchInput) return;

      try {
        // Search for artist via backend proxy
        const artistResponse = await fetch(
          `${API_BASE_URL}/api/spotify/search?q=${encodeURIComponent(searchInput)}&type=artist&limit=1`
        );
        const artistData = await artistResponse.json().catch(() => null);

        if (!artistData?.artists?.items?.length) {
          console.error("No artist found");
          return;
        }

        const artistID = artistData.artists.items[0].id;

        // Fetch albums via backend proxy
        const albumsResponse = await fetch(
          `${API_BASE_URL}/api/spotify/artists/${artistID}/albums?market=US&limit=50`
        );
        const albumsData = await albumsResponse.json().catch(() => null);

        if (!albumsData?.items) {
          console.error("No albums found");
          return;
        }

        setAlbums(albumsData.items);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, [searchInput]);

  const handleViewDetails = async (albumId) => {
    try {
      // Check if album exists in local database
      const localResponse = await fetch(
        `${API_BASE_URL}/api/albums/${albumId}`
      );

      if (!localResponse.ok) {
        console.error(
          "Local album fetch failed with status",
          localResponse.status
        );
      }

      const localResult = await localResponse.json().catch(() => null);

      // If album exists, navigate to that page
      if (localResult?.id) {
        console.log("Album found in local database. Navigating...");
        navigate(`/album/${albumId}`);
        return;
      }

      // If album doesn't exist, fetch it from Spotify via backend proxy
      const spotifyResponse = await fetch(
        `${API_BASE_URL}/api/spotify/albums/${albumId}`
      );

      if (!spotifyResponse.ok) {
        console.error(
          "Spotify fetch failed with status",
          spotifyResponse.status
        );
        return;
      }

      const spotifyResult = await spotifyResponse.json().catch(() => null);

      if (!spotifyResult) {
        console.error("Failed to parse Spotify API response as JSON");
        return;
      }

      // Prepare album data for local database
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

      // Save the album to local database
      const saveResponse = await fetch(`${API_BASE_URL}/api/albums/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(albumData),
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save album to local db");
      }

      // Navigate to the new album page

      navigate(`/album/${albumId}`);
    } catch (error) {
      console.error("Error handling album details:", error);
    }
  };

  return (
    <Container>
      <h2>Search Results for "{searchInput}"</h2>
      <Row className={styles.row}>
        {albums.map((album) => (
          <Card key={album.id} className={styles.card}>
            <Card.Img src={album.images[0].url} className={styles.img} />
            <Card.Body>
              <Card.Title className={styles.title}>
                {/* {album.id} */}
                {album.name}
              </Card.Title>
              <Card.Text className={styles.release}>
                Release Date: <br /> {album.release_date}
              </Card.Text>
              <Button
                target="_blank"
                href={album.external_urls.spotify}
                className={styles.button}
              >
                Album Link
              </Button>
              <Button
                className={styles.button}
                onClick={() => handleViewDetails(album.id)}
              >
                View Details
              </Button>
            </Card.Body>
          </Card>
        ))}
      </Row>
    </Container>
  );
}

export default Results;
