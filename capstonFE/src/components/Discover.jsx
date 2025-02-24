import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Discover.module.css';

function Discover() {
  const [albums, setAlbums] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAccessToken() {
      const clientId = import.meta.env.VITE_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        console.error('Missing Spotify API credentials. Check your .env file.');
        return;
      }

      try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
          },
          body: 'grant_type=client_credentials',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            `Error fetching access token: ${
              data.error_description || 'Unknown error'
            }`
          );
        }

        setAccessToken(data.access_token);
      } catch (error) {
        console.error('Failed to fetch access token:', error);
      }
    }

    fetchAccessToken();
  }, []);

  useEffect(() => {
    async function sendAlbumsToDatabase(albums) {
      try {
        const response = await fetch(
          'http://localhost:3000/api/albums/create',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(albums),
          }
        );
        if (!response) {
          throw new Error('Failed to save albums to database');
        }
        console.log('Saved albums to database');
      } catch (error) {
        console.error('Error sending albums to database: ', error);
      }
    }

    async function getTopAlbums() {
      if (!accessToken) return;

      try {
        const response = await fetch(
          'https://api.spotify.com/v1/browse/new-releases?limit=50',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            `Error fetching albums: ${data.error?.message || 'Unknown error'}`
          );
        }

        if (!data.albums || !data.albums.items) {
          throw new Error('Invalid data format received from Spotify API');
        }

        setAlbums(data.albums.items);

        // save albums to database
        //uncomment this block to save albums to database

        // const formattedAlbums = data.albums.items.map(
        //   async (album) =>
        //     await sendAlbumsToDatabase({
        //       spotify_id: album.id,
        //       name: album.name,
        //       artist: album.artists[0].name,
        //       image: album.images[0].url,
        //       spotifyUrl: album.external_urls.spotify,
        //     })
        // );
        // await Promise.all(formattedAlbums);
      } catch (error) {
        console.error('Failed to fetch top albums!:', error);
      }
    }

    getTopAlbums();
  }, [accessToken]);

  const handleViewDetails = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  return (
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
                onClick={() => handleViewDetails(album.id)}>
                View Details
              </button>
              <a
                href={album.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}>
                Listen on Spotify
              </a>
            </div>
          </div>
        ))
      ) : (
        <p>Loading albums...</p>
      )}
    </div>
  );
}

export default Discover;
