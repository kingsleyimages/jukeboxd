import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import jukeboxdLogo from "../images/jukeboxdLogoTransparent.png";
import App from "./Search";

function Navbar() {
  const { isLoggedIn, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect home
  };

  return (
    <div className="nav-container">
      <nav>
        <Link to="/">
          <img
            src={jukeboxdLogo}
            alt="Jukeboxd logo"
            style={{ width: "70px" }}
          />
        </Link>
        {isLoggedIn ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/discover">Albums</Link>
            <Link to="/reviews">Reviews</Link>
            {/* <Link to="/search">Search</Link> */}
            <App />
            <Link to="/account">Account</Link>
            {isAdmin && <Link to="/admin/dashboard">Admin Dashboard</Link>}
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/discover">Albums</Link>
            <Link to="/reviews">Reviews</Link>
            <App />
            {/* <Link to="/search">Search</Link> */}
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      
    </div>
    
  );
}

export default Navbar;