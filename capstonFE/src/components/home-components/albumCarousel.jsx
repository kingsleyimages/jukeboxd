import { motion } from "framer-motion";

const albumCovers = [
	"https://via.placeholder.com/150/FF0000", // Replace with real album cover URLs
	"https://via.placeholder.com/150/00FF00",
	"https://via.placeholder.com/150/0000FF",
	"https://via.placeholder.com/150/FFFF00",
	"https://via.placeholder.com/150/FF00FF",
];

export default function AlbumCarousel() {
	return (
		<div className="overflow-hidden w-full bg-black py-4 relative flex justify-end">
			<motion.div
				className="flex w-max gap-4"
				initial={{ x: "100%" }}
				animate={{ x: "-100%" }}
				transition={{
					repeat: Infinity,
					duration: 30,
					ease: "linear",
				}}
			>
				{[...albumCovers, ...albumCovers, ...albumCovers].map(
					(cover, index) => (
						<img
							key={index}
							src={cover}
							alt={`Album Cover ${index}`}
							className="w-40 h-40 object-cover rounded-xl"
						/>
					)
				)}
			</motion.div>
		</div>
	);
}
