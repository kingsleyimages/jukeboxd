const pg = require("pg");
const client = new pg.Client();

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
  await client.query(SQL);
  console.log("tables created");
};

module.exports = {
  client,
  // ...require('./user.js'),
  // ...require('./review.js'),
  createTables,
};
