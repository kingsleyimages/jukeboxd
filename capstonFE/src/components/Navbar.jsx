import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import jukeboxdLogo from "../images/jukeboxdLogoTransparent.png";
import App from "./Search";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      setIsLoggedIn(!!token);
      setIsAdmin(user?.role === "admin");
    };

    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");

    window.dispatchEvent(new Event("storage"));
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
            {/* Navigation for logged-in users */}
            <Link to="/">Home</Link>
            <Link to="/discover">Albums</Link>
            <Link to="/reviews">Reviews</Link>
            {/* <Link to="/search">Search</Link> */}
            <App />
            <Link to="/account">Account</Link>
            {isAdmin && <Link to="/admin/dashboard">Admin Dashboard</Link>}{" "}
            {/* Admin link */}
            <button onClick={onLogout} className="logout-button">
              Log out
            </button>
          </>
        ) : (
          <>
            {/* Navigation for non-logged-in users */}
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
