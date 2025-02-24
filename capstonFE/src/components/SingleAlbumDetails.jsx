import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AlbumDetails = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/albums/${albumId}`
        );
        const data = await response.json();
        setAlbum(data);
      } catch (error) {
        console.error("Error fetching album details:");
      }
    };

    fetchAlbumDetails();
  }, [albumId]);

  if (!album) return <div>Loading...</div>;

  return (
    <div>
      <h1>{album.name}</h1>
      <p>Artist: {album.artist}</p>
      <img src={album.image} alt={album.name} />
    </div>
  );
};

export default AlbumDetails;
