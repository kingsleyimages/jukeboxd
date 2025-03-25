import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, InputGroup, FormControl, Button } from "react-bootstrap";
import styles from "../css/Search.module.css";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL_PROD ||
  import.meta.env.VITE_API_BASE_URL_DEV;

function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessToken = async () => {
      const authParams = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body:
          "grant_type=client_credentials&client_id=" +
          clientId +
          "&client_secret=" +
          clientSecret,
      };

      const response = await fetch(
        "https://accounts.spotify.com/api/token",
        authParams
      );
      const data = await response.json();
      setAccessToken(data.access_token);
    };

    fetchAccessToken();
  }, []);

  const search = async () => {
    const artistParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    try {
      // Get Artist
      const artistResponse = await fetch(
        "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
        artistParams
      );
      const artistData = await artistResponse.json();
      if (!artistData.artists || !artistData.artists.items.length) {
        throw new Error("No artist found");
      }
      const artistID = artistData.artists.items[0].id;

      // Get Artist Albums
      const albumsResponse = await fetch(
        "https://api.spotify.com/v1/artists/" +
          artistID +
          "/albums?include_groups=album&market=US&limit=50",
        artistParams
      );
      const albumsData = await albumsResponse.json();
      if (!albumsData.items) {
        throw new Error("No albums found");
      }

      setAlbums(albumsData.items);
      navigate(`/results/${searchInput}`, {
        state: { searchInput, results: albumsData.items },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Container className={styles.searchContainer}>
      <InputGroup className={styles.inner}>
        <FormControl
          placeholder="Search For Artist"
          type="input"
          aria-label="Search for an Artist"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              search();
            }
          }}
          onChange={(event) => setSearchInput(event.target.value)}
          className={styles.search}
        />
        <Button className={styles.button} onClick={search}>
          Search
        </Button>
      </InputGroup>
    </Container>
  );
}

export default Search;
