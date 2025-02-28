import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jukeboxdLogo from '../images/jukeboxdLogoTransparent.png';
// Remove the import for handleLogout

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

 // Check if user is logged in and if they are an admin when component mounts and when auth state changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      setIsLoggedIn(!!token); // Convert to boolean
      setIsAdmin(user?.role === 'admin'); // Check if user is an admin
      console.log('Auth check - Token exists:', !!token); // Debug log
      console.log('Auth check - User is admin:', user?.role === 'admin'); // Debug log
    };

    // Initial check
    checkLoginStatus();

    // Listen for auth changes
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // Implement handleLogout directly in this component
  const onLogout = () => {
    // Remove token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    console.log('Logout executed, localStorage cleared'); // Debug log

    // Redirect to home page
    navigate('/');

    // Trigger storage event for other components to detect logout
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="nav-container">
      <nav>
        <img src={jukeboxdLogo} alt="Jukeboxd logo" style={{ width: '70px' }} />
        {isLoggedIn ? (
         <>
            {/* Navigation for logged-in users */}
            <Link to="/">Home</Link>
            <Link to="/discover">Discover</Link>
            <Link to="/search">Search</Link>
            <Link to="/account">Account</Link>
            {isAdmin && <Link to="/admin/dashboard">Admin Dashboard</Link>} {/* Admin link */}
            <button onClick={onLogout} className="logout-button">
              Log out
            </button>
          </>
        ) : (
          <>
            {/* Navigation for non-logged-in users */}
            <Link to="/discover">Albums</Link>
            <Link to="/">Home</Link>
            <Link to="/search">Search</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
