import React from "react";
import AlbumCarousel from "./home-components/albumCarousel";
import { Link } from "react-router-dom";
import "./home-components/home.css";

function Home() {
	return (
		<div className="home-container">
			<section className="hero">
				<h1>Welcome to Jukeboxd</h1>
				<p>
					Track albums you've listened to, share your favorites, and
					discover new gems!
				</p>
			</section>
			<Link to="/search" className="cta-button">
					Start finding albums!
				</Link>

			<AlbumCarousel />
		</div>
	);
}

export default Home;
