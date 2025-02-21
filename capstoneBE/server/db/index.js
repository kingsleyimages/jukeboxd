const pg = require("pg");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
const pool = new Pool();

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS friends;
    DROP TABLE IF EXISTS mixtapes;
    DROP TABLE IF EXISTS songs;
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS albums;
    DROP TABLE IF EXISTS users;
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(20) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE albums(
      id UUID PRIMARY KEY,
      spotify_id VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE reviews(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      album_id UUID REFERENCES albums(id) NOT NULL,
      rating INT NOT NULL DEFAULT 0,
      favorite BOOLEAN NOT NULL DEFAULT false,
      headline TEXT NOT NULL,
      review TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unique_user_id_album_id UNIQUE (user_id, album_id)
    );

    CREATE TABLE comments(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      review_id UUID REFERENCES reviews(id) NOT NULL,
      comment TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unique_user_id_review_id UNIQUE (user_id, review_id)
    );

    CREATE TABLE friends(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      friend_id UUID REFERENCES users(id) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unique_user_id_friend_id UNIQUE (user_id, friend_id)
    );

    CREATE TABLE songs(
      id UUID PRIMARY KEY,
      spotify_id VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE mixtapes(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      song_id UUID REFERENCES songs(id) NOT NULL,
      album_id UUID REFERENCES albums(id) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await pool.query(SQL);
  console.log("tables created");

  // Insert dummy data
  const users = [
    { username: 'user1', email: 'user1@example.com', password: 'password123', role: 'user' },
    { username: 'user2', email: 'user2@example.com', password: 'mypassword', role: 'admin' },
    { username: 'user3', email: 'user3@example.com', password: 'supersecret', role: 'user' },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await pool.query('INSERT INTO users (id, username, email, password, role) VALUES ($1, $2, $3, $4, $5)', [uuidv4(), user.username, user.email, hashedPassword, user.role]);
  }

  console.log("dummy data inserted");
};

module.exports = {
  pool,
  createTables,
};
