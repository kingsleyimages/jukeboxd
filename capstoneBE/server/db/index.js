const { Pool } = require("pg");

const client = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const createTables = async () => {
  const SQL = `
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS friends;
DROP TABLE IF EXISTS listenedto;
DROP TABLE IF EXISTS mixtapes;
DROP TABLE IF EXISTS songs;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS tracks;
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS albums(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spotify_id VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  spotifyUrl VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tracks(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  spotify_id VARCHAR(255) NOT NULL UNIQUE,
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    CREATE TABLE IF NOT EXISTS reviews(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
      album_id UUID REFERENCES albums(id) NOT NULL,
      rating INT NOT NULL DEFAULT 0,
      favorite BOOLEAN DEFAULT false,
      headline TEXT NOT NULL,
      review TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unique_user_id_album_id UNIQUE (user_id, album_id)
    );

CREATE TABLE IF NOT EXISTS comments(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_id_review_id UNIQUE (user_id, review_id)
);

CREATE TABLE IF NOT EXISTS friends(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_id_friend_id UNIQUE (user_id, friend_id)
);

CREATE TABLE IF NOT EXISTS listenedto(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL, 
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE NOT NULL,
  is_listened BOOLEAN DEFAULT false NOT NULL, 
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  CONSTRAINT unique_user_album UNIQUE (user_id, album_id)
)
;`;
  await client.query(SQL);

  console.log("tables created");
};

module.exports = {
  client,
  createTables,
};
