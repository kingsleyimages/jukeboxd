require('dotenv').config({ path: '../../.env' });
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

console.log('Environment Variables:');
console.log('PGUSER:', process.env.PGUSER);
console.log('PGHOST:', process.env.PGHOST);
console.log('PGDATABASE:', process.env.PGDATABASE);
console.log('PGPASSWORD:', process.env.PGPASSWORD ? '******' : 'Not Set');
console.log('PGPORT:', process.env.PGPORT);

if (
  !process.env.PGUSER ||
  !process.env.PGHOST ||
  !process.env.PGDATABASE ||
  !process.env.PGPASSWORD ||
  !process.env.PGPORT
) {
  console.error('One or more environment variables are missing.');
  process.exit(1);
}

const client = new Client({
  connectionString: `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,
});

const seed = async () => {
  try {
    await client.connect();
    console.log('connected to database');

    // Create dummy users
    const users = [
      {
        username: `user${uuid.v4().slice(0, 8)}`,
        email: `user${uuid.v4().slice(0, 8)}@example.com`,
        password: 'password11',
        role: 'user',
      },
      {
        username: `user${uuid.v4().slice(0, 8)}`,
        email: `user${uuid.v4().slice(0, 8)}@example.com`,
        password: 'password22',
        role: 'user',
      },
    ];

    const userIds = [];
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 5);
      const result = await client.query(
        `INSERT INTO users(id, username, email, password, role) VALUES($1, $2, $3, $4, $5) RETURNING id`,
        [uuid.v4(), user.username, user.email, hashedPassword, user.role]
      );
      userIds.push(result.rows[0].id);
    }

    // Create dummy albums with random spotify_id and artist
    // const albums = [
    //   {
    //     spotify_id: `album${uuid.v4().slice(0, 8)}`,
    //     artist: `Artist ${uuid.v4().slice(0, 8)}`,
    //     image:
    //       'https://media.newyorker.com/photos/63923da2d0ec9d802329ed2b/master/w_2240,c_limit/ra1091.jpg',
    //     spotifyUrl:
    //       'https://www.shopelvis.com/?srsltid=AfmBOorFMHyEoUuPE5e0ukHeXNJfrg3xlf5pOUVBpBXj-1JS5jv_QN7g',
    //   },
    //   {
    //     spotify_id: `album${uuid.v4().slice(0, 8)}`,
    //     artist: `Artist ${uuid.v4().slice(0, 8)}`,
    //     image:
    //       'https://media.newyorker.com/photos/63923da2d0ec9d802329ed2b/master/w_2240,c_limit/ra1091.jpg',
    //     spotifyUrl:
    //       'https://www.shopelvis.com/?srsltid=AfmBOorFMHyEoUuPE5e0ukHeXNJfrg3xlf5pOUVBpBXj-1JS5jv_QN7g',
    //   },
    //   {
    //     spotify_id: `album${uuid.v4().slice(0, 8)}`,
    //     artist: `Artist ${uuid.v4().slice(0, 8)}`,
    //     image:
    //       'https://media.newyorker.com/photos/63923da2d0ec9d802329ed2b/master/w_2240,c_limit/ra1091.jpg',
    //     spotifyUrl:
    //       'https://www.shopelvis.com/?srsltid=AfmBOorFMHyEoUuPE5e0ukHeXNJfrg3xlf5pOUVBpBXj-1JS5jv_QN7g',
    //   },
    //   {
    //     spotify_id: `album${uuid.v4().slice(0, 8)}`,
    //     artist: `Artist ${uuid.v4().slice(0, 8)}`,
    //     image:
    //       'https://media.newyorker.com/photos/63923da2d0ec9d802329ed2b/master/w_2240,c_limit/ra1091.jpg',
    //     spotifyUrl:
    //       'https://www.shopelvis.com/?srsltid=AfmBOorFMHyEoUuPE5e0ukHeXNJfrg3xlf5pOUVBpBXj-1JS5jv_QN7g',
    //   },
    //   {
    //     spotify_id: `album${uuid.v4().slice(0, 8)}`,
    //     artist: `Artist ${uuid.v4().slice(0, 8)}`,
    //     image:
    //       'https://media.newyorker.com/photos/63923da2d0ec9d802329ed2b/master/w_2240,c_limit/ra1091.jpg',
    //     spotifyUrl:
    //       'https://www.shopelvis.com/?srsltid=AfmBOorFMHyEoUuPE5e0ukHeXNJfrg3xlf5pOUVBpBXj-1JS5jv_QN7g',
    //   },
    // ];

    // const albumIds = [];
    // for (const album of albums) {
    //   const result = await client.query(
    //     `INSERT INTO albums(id, spotify_id, artist, image, spotifyUrl) VALUES($1, $2, $3, $4, $5) RETURNING id`,
    //     [
    //       uuid.v4(),
    //       album.spotify_id,
    //       album.artist,
    //       album.image,
    //       album.spotifyUrl,
    //     ]
    //   );
    //   albumIds.push(result.rows[0].id);
    // }

    // Create dummy reviews
    const reviews = [];
    for (const userId of userIds) {
      for (const albumId of albumIds) {
        reviews.push({
          user_id: userId,
          album_id: albumId,
          rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
          favorite: Math.random() < 0.5, // Random boolean for favorite
          headline: `Review for album ${albumId}`,
          review: `This is a review for album ${albumId} by user ${userId}.`,
        });
      }
    }

    const reviewIds = [];
    for (const review of reviews) {
      const result = await client.query(
        `INSERT INTO reviews(id, user_id, album_id, rating, favorite, headline, review) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [
          uuid.v4(),
          review.user_id,
          review.album_id,
          review.rating,
          review.favorite,
          review.headline,
          review.review,
        ]
      );
      reviewIds.push(result.rows[0].id);
    }

    // Create dummy comments
    const comments = [];
    for (const reviewId of reviewIds) {
      for (const userId of userIds) {
        comments.push({
          user_id: userId,
          review_id: reviewId,
          comment: `This is a comment on review ${reviewId} by user ${userId}.`,
        });
      }
    }

    for (const comment of comments) {
      await client.query(
        `INSERT INTO comments(id, user_id, review_id, comment) VALUES($1, $2, $3, $4)`,
        [uuid.v4(), comment.user_id, comment.review_id, comment.comment]
      );
    }

    console.log('Dummy data created successfully');
  } catch (error) {
    console.error('error creating tables');
    throw error;
  } finally {
    await client.end();
  }
};

seed();
