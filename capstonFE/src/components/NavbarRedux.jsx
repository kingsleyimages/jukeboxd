import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styles from "../css/NavbarRedux.module.css";
import jukeboxdLogo from "../images/jukeboxdLogoTransparent.png";

function NavbarRedux() {
  const { isLoggedIn, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect home
  };

  return (
    <Navbar
      fixed="top"
      className={styles["navBarKT"]}
      collapseOnSelect
      expand="lg">
      <Navbar.Brand className={`ms-4 ${styles["navBrandKT"]}`} href="/">
        <img src={jukeboxdLogo} alt="logo" className={styles["navLogoKT"]} />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" className="me-4" />
      <Navbar.Collapse
        id="responsive-navbar-nav"
        className={`me-4 ${styles["navbar-collapseKT"]}`}>
        <Nav className="ml-auto">
          <Nav.Link className={styles["navLinkKT"]} href="/">
            Home
          </Nav.Link>
          <Nav.Link className={styles["navLinkKT"]} href="/discovee">
            Albums
          </Nav.Link>
          <Nav.Link className={styles["navLinkKT"]} href="/reviews">
            Reviews
          </Nav.Link>
          <Nav.Link className={styles["navLinkKT"]} href="/account">
            Account
          </Nav.Link>
          <Nav.Link className={styles["navLinkKT"]} href="/login">
            Login
          </Nav.Link>
          <Nav.Link className={styles["navLinkKT"]} href="/register">
            Register
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarRedux;
