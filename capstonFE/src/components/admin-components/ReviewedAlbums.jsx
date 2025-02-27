import React, { useEffect, useState } from 'react';

function ReviewedAlbums() {
  const [albums, setAlbums] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Fetching albums with reviews...');
    fetch('http://localhost:3000/api/albums/reviewed', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log('Response:', response);
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        return response.json();
      })
      .then((data) => {
        console.log('Fetched albums with reviews:', data);
        if (Array.isArray(data)) {
          setAlbums(data);
        } else {
          setAlbums([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching albums with reviews:', error);
        setErrorMessage("An error occurred while fetching albums with reviews");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div>
      <h2>Reviewed Albums</h2>
      <ul>
        {albums.map((album) => (
          <li key={album.id}>
            <h3>{album.name} by {album.artist}</h3>
            <p><strong>Spotify ID:</strong> {album.spotify_id}</p>
            <p><strong>Image:</strong> <img src={album.image} alt={album.name} /></p>
            <p><strong>Spotify URL:</strong> <a href={album.spotifyUrl} target="_blank" rel="noopener noreferrer">{album.spotifyUrl}</a></p>
            <h4>Reviews:</h4>
            <ul>
              {album.reviews.map((review) => (
                <li key={review.review_id}>
                  <p><strong>Rating:</strong> {review.rating}</p>
                  <p><strong>Favorite:</strong> {review.favorite ? 'Yes' : 'No'}</p>
                  <p><strong>Headline:</strong> {review.headline}</p>
                  <p><strong>Review:</strong> {review.review}</p>
                  <p><strong>Created At:</strong> {new Date(review.review_created_at).toLocaleString()}</p>
                  <p><strong>Updated At:</strong> {new Date(review.review_updated_at).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReviewedAlbums;