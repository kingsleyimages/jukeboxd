import React from "react";
import AlbumCarousel from "./home-components/albumCarousel";
import { Link } from "react-router-dom";

function Home() {
	return (
		<>
			<AlbumCarousel />
			<h2>
				Track albums you've listened to. <br />
				Tell your friends what's good. <br />
				Discover new gems! <br />
			</h2>
			<div>
				<Link to="/search">Start finding albums!</Link>
			</div>
		</>
	);
}

export default Home;
