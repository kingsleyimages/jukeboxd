import React from 'react';
import '../App.css';
import styles from '../css/Search.module.css';
import {
  FormControl,
  InputGroup,
  Container,
  Button,
  Card,
  Row,
} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let authParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body:
        'grant_type=client_credentials&client_id=' +
        clientId +
        '&client_secret=' +
        clientSecret,
    };

    fetch('https://accounts.spotify.com/api/token', authParams)
      .then((result) => result.json())
      .then((data) => {
        setAccessToken(data.access_token);
        console.log(data);
      });
  }, []);

  async function addReview(e) {
    //needs to be fixed!!
    // e.preventDefault();
    // e.selectTarget;
    // const response = await fetch("", { method: "POST" });
  }

  async function search() {
    let artistParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    };

    // Get Artist
    const artistID = await fetch(
      'https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist',
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    // Get Artist Albums
    await fetch(
      'https://api.spotify.com/v1/artists/' +
        artistID +
        '/albums?include_groups=album&market=US&limit=50',
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        setAlbums(data.items);
      });
    // Get Artist Albums
    await fetch(
      'https://api.spotify.com/v1/artists/' +
        artistID +
        '/albums?include_groups=album&market=US&limit=50',
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        setAlbums(data.items);
      });
  }

  const handleViewDetails = async (albumId) => {
    try {
      // Check if album exists in local database
      const localResponse = await fetch(
        `https://jukeboxd-znlr.onrender.com/api/albums/${albumId}`
      );

      if (!localResponse.ok) {
        console.error(
          'local album fetch failed with status',
          localResponse.status
        );
      }

      const localResult = await localResponse.json().catch(() => null);
      console.log('local database result:', localResult);

      // If album exists, navigate to that page
      if (localResult?.id) {
        navigate(`/album/${albumId}`);
        return;
      }

      console.log('album not found locally, fetching from spotify');

      // If album doesn't exist, fetch it from Spotify
      const spotifyResponse = await fetch(
        `https://api.spotify.com/v1/albums/${albumId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Check for Spotify API errors
      if (!spotifyResponse.ok) {
        console.error(
          'spotify fetch failed with status',
          spotifyResponse.status
        );
        return;
      }

      const spotifyResult = await spotifyResponse.json().catch(() => null);

      if (!spotifyResult) {
        console.error('failed to parse Spotify API response as JSON');
        return;
      }
      console.log('spotify api result:', spotifyResult);

      //prepare album data for local database
      const albumData = {
        name: spotifyResult.name,
        artist: spotifyResult.artists[0]?.name || 'unknown artist',
        image: spotifyResult.images[0]?.url || '',
        spotify_id: spotifyResult.id,
        spotifyUrl: spotifyResult.external_urls?.spotify,
        tracks: spotifyResult.tracks.items.map((track) => ({
          title: track.name,
          spotify_id: track.id,
          track_number: track.track_number,
        })),
      };

      // Save the album to local database

      // await fetch(`https://jukeboxd-znlr.onrender.com/albums`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(spotifyResult),
      // });
      const saveResponse = await fetch(
        `https://jukeboxd-znlr.onrender.com/api/albums/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(albumData),
        }
      );

      if (!saveResponse.ok) {
        throw new Error('failed to save album to local db');
      }
      console.log('album saved to local db');

      // Navigate to the new album page
      navigate(`/album/${albumId}`);
    } catch (error) {
      console.error('Error handling album details:', error);
    }
  };

  return (
    <>
      <Container className={styles.searchContainer}>
        <InputGroup className={styles.inner}>
          <FormControl
            placeholder="Search For Artist"
            type="input"
            aria-label="Search for an Artist"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
            className={styles.search}
          />
          <Button className={styles.button} onClick={search}>
            Search
          </Button>
          {/* <Button className={styles.button} onClick={addReview}>
            Add a Review
          </Button> */}
        </InputGroup>
      </Container>

      <Container>
        <Row className={styles.row}>
          {albums.map((album) => {
            return (
              <Card key={album.id} className={styles.card}>
                <Card.Img src={album.images[0].url} className={styles.img} />
                <Card.Body>
                  <Card.Title className={styles.title}>{album.name}</Card.Title>
                  <Card.Text className={styles.release}>
                    Release Date: <br /> {album.release_date}
                  </Card.Text>
                  <Button
                    target="_blank"
                    href={album.external_urls.spotify}
                    className={styles.button}>
                    Album Link
                  </Button>
                  <Button
                    className={styles.button}
                    onClick={() => handleViewDetails(album.id)}>
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>
    </>
  );
}

export default App;
