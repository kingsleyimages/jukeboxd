import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AlbumCarousel() {
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_PROD ||
    import.meta.env.VITE_API_BASE_URL_DEV;

  // 🔹 Fetch albums from the local database
  useEffect(() => {
    async function fetchAlbumsFromDB() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/albums`);
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Invalid or empty response from database");
        }

        setAlbums(data);
      } catch (error) {
        console.error("Error fetching albums from database:", error);
      }
    }

    fetchAlbumsFromDB();
  }, []);

  const duplicatedAlbums =
    albums.length > 0 ? [...albums, ...albums, ...albums] : [];

  return (
    <div className="overflow-hidden w-full bg-black py-4 relative">
      <motion.div
        className="flex w-max gap-4 items-center"
        style={{
          display: "flex",
          flexDirection: "row",
          whiteSpace: "nowrap",
        }}
        animate={{ x: ["0%", "-100%"] }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
      >
        {duplicatedAlbums.map((album, index) => (
          <img
            key={index}
            src={album.image}
            alt={album.name}
            className="w-40 h-40 object-cover rounded-xl inline-block cursor-pointer"
            style={{ display: "inline-block" }}
            onClick={() => navigate(`/album/${album.spotify_id}`)}
          />
        ))}
      </motion.div>
    </div>
  );
}

// import { motion } from "framer-motion";

// const albumCovers = [
//   "https://i.scdn.co/image/ab67616d00001e025076e4160d018e378f488c33",
//   "https://i.scdn.co/image/ab67616d00001e026fcdcbbd9cae9001ca5b20d5",
//   "https://i.scdn.co/image/ab67616d00001e028a9dc89bd612b7f4670e2390",
//   "https://i.scdn.co/image/ab67616d00001e0224861100b34630be0af122ce",
//   "https://i.scdn.co/image/ab67616d00001e02f7ee7120f7bf51045dff090d",
//   "https://i.scdn.co/image/ab67616d00001e02a56f5696231c1ad328fc9445",
//   "https://i.scdn.co/image/ab67616d00001e02f0722706190993eadd8ad6aa",
//   "https://i.scdn.co/image/ab67616d00001e027198e498826796ff81f560a7",
//   "https://i.scdn.co/image/ab67616d00001e020acf414348b3ca9a6f538690",
//   "https://i.scdn.co/image/ab67616d00001e020a0de163efc03ffc3bc597af",
// ];

// export default function AlbumCarousel() {
//   // Duplicate images for seamless infinite scrolling
//   const duplicatedCovers = [...albumCovers, ...albumCovers];

//   return (
//     <div className="overflow-hidden w-full bg-black py-4 relative">
//       <motion.div
//         className="flex w-max gap-4 items-center"
//         style={{
//           display: "flex",
//           flexDirection: "row",
//           whiteSpace: "nowrap",
//         }}
//         animate={{ x: ["0%", "-100%"] }} // Moves left infinitely
//         transition={{
//           repeat: Infinity,
//           duration: 20, // Adjust speed as needed
//           ease: "linear",
//         }}
//       >
//         {duplicatedCovers.map((cover, index) => (
//           <img
//             key={index}
//             src={cover}
//             alt={`Album Cover ${index}`}
//             className="w-40 h-40 object-cover rounded-xl inline-block"
//             style={{ display: "inline-block" }}
//           />
//         ))}
//       </motion.div>
//     </div>
//   );
// }
