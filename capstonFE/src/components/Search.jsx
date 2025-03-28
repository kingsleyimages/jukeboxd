import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, InputGroup, FormControl, Button } from "react-bootstrap";
import styles from "../css/Search.module.css";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL_PROD ||
  import.meta.env.VITE_API_BASE_URL_DEV;

function Search() {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim() === "") {
      alert("Please enter a search term.");
      return;
    }
    navigate(`/results/${searchInput}`);
    setSearchInput("");
  };
  return (
    <Container className={styles.searchContainer}>
      <form onSubmit={handleSubmit}>
        <InputGroup className={styles.inner}>
          <FormControl
            placeholder="Search For Artist"
            type="input"
            aria-label="Search for an Artist"
            value={searchInput}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSubmit(event);
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
            className={styles.search}
          />
          <Button className={styles.button} type="submit">
            Search
          </Button>
        </InputGroup>
      </form>
    </Container>
  );
}

export default Search;
