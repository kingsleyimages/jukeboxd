import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import jukeboxdLogo from "../images/jukeboxdLogoTransparent.png";
import App from "./Search";

function Navbar() {
  const { isLoggedIn, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect home
    setIsMenuOpen(false); // Close menu on logout
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu state
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // Close menu when a link is clicked
  };

  return (
    <div className="nav-container">
      <nav>
        {/* Logo */}
        <Link to="/" onClick={closeMenu}>
          <img
            src={jukeboxdLogo}
            alt="Jukeboxd logo"
            style={{ width: "70px" }}
          />
        </Link>

        {/* Hamburger Menu Button */}
        <button className="hamburger-menu" onClick={toggleMenu}>
          ☰
        </button>

        {/* Navigation Links */}
        <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          {isLoggedIn ? (
            <>
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>
              <Link to="/discover" onClick={closeMenu}>
                Albums
              </Link>
              <Link to="/reviews" onClick={closeMenu}>
                Reviews
              </Link>
              {/* <Link to="/search">Search</Link> */}
              <App />
              <Link to="/account" onClick={closeMenu}>
                Account
              </Link>
              {isAdmin && (
                <Link to="/admin/dashboard" onClick={closeMenu}>
                  Admin Dashboard
                </Link>
              )}
              <button onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>
              <Link to="/discover" onClick={closeMenu}>
                Albums
              </Link>
              <Link to="/reviews" onClick={closeMenu}>
                Reviews
              </Link>
              <App />
              {/* <Link to="/search">Search</Link> */}
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
