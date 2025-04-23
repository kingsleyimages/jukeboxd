import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styles from "../css/NavbarRedux.module.css";
import jukeboxdLogo from "../images/jukeboxdLogoTransparent.png";
import Search from "./Search";

function NavbarRedux() {
  const { isLoggedIn, isAdmin, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect home
    setIsMenuOpen(false); // Close the menu after logout
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // Close the menu when a link is clicked
  };

  return (
    <Navbar
      fixed="top"
      className={styles["navBarJukeboxd"]}
      expand="lg"
      expanded={isMenuOpen} // Control the menu state
    >
      <Navbar.Brand className="ms-4" as={Link} to="/">
        <img src={jukeboxdLogo} alt="logo" className={styles["logoImg"]} />
      </Navbar.Brand>
      <Navbar.Toggle
        aria-controls="responsive-navbar-nav"
        className={`me-4 ${styles["toggler"]}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu state
      />
      <Navbar.Collapse
        id="responsive-navbar-nav"
        className={`me-4 ${styles["linkWrapper"]}`}>
        <Nav className={`ms-auto ${styles["linkAlign"]}`}>
          <Nav.Link
            as={Link}
            to="/"
            onClick={closeMenu}
            className={styles["linkStyle"]}>
            Home
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/discover"
            onClick={closeMenu}
            className={styles["linkStyle"]}>
            Albums
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/reviews"
            onClick={closeMenu}
            className={styles["linkStyle"]}>
            Reviews
          </Nav.Link>
          <Search closeMenu={closeMenu} />
          {isLoggedIn ? (
            <>
              <Nav.Link
                as={Link}
                to="/account"
                onClick={closeMenu}
                className={styles["linkStyle"]}>
                Account
              </Nav.Link>
              {isAdmin && (
                <Nav.Link
                  as={Link}
                  to="/admin/dashboard"
                  onClick={closeMenu}
                  className={styles["linkStyle"]}>
                  Admin Dashboard
                </Nav.Link>
              )}
              <Nav.Link
                as="button"
                onClick={handleLogout}
                className={styles["linkStyle"]}
                role="button">
                Log out
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link
                as={Link}
                to="/login"
                onClick={closeMenu}
                className={styles["linkStyle"]}>
                Login
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/register"
                onClick={closeMenu}
                className={styles["linkStyle"]}>
                Register
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarRedux;
