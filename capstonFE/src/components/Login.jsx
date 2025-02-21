import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ accessToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [albums, setAlbums] = useState([]);

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/login', { username, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            navigate('/home');
        } catch (error) {
            console.error('Login failed', error);
            alert('Invalid username or password');
        }
    };

    useEffect(() => {
        async function sendAlbumsToDatabase(albums) {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/albums",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(albums),
                    }
                );
                if (!response) {
                    throw new Error("Failed to save albums to database");
                }
                console.log("Saved albums to database");
            } catch (error) {
                console.error("Error sending albums to database: ", error);
            }
        }

        async function getTopAlbums() {
            if (!accessToken) return; // Ensure access token is available before making API call

            try {
                const response = await fetch(
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
                        `Error fetching albums: ${
                            data.error?.message || "Unknown error"
                        }`
                    );
                }

                if (!data.albums || !data.albums.items) {
                    throw new Error(
                        "Invalid data format received from Spotify API"
                    );
                }

                const formattedAlbums = data.albums.items.map((album) => ({
                    id: album.id,
                    name: album.name,
                    artist: album.artists[0].name,
                    image: album.images[0].url,
                    spotifyUrl: album.external_urls.spotify,
                }));

                setAlbums(data.albums.items);
                sendAlbumsToDatabase(formattedAlbums);
            } catch (error) {
                console.error("Failed to fetch top albums:", error);
            }
        }

        getTopAlbums();
        sendAlbumsToDatabase(albums);
    }, [accessToken]); // Run only when accessToken updates

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
