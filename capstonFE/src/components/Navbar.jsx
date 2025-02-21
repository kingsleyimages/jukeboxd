import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
	return (
		<div className="nav-container">
			<nav>
				<Link to="/discover">Albums</Link>
				<Link to="/">Home</Link>
				<Link to="/search">Search</Link>
				<Link to="/login">Login</Link>
				<Link to="/register">Register</Link>
			</nav>
		</div>
	);
}
export default Navbar;
