require('dotenv').config({ path: '../.env' });
const { client } = require('./server/db/index.js');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/api', require('./server/api'));
app.use('/api/reviews', require('./server/api/reviewRoutes.js'));
app.use('/api/users', require('./server/api/userRoutes.js'));



// Log environment variables to ensure they are being read correctly
console.log('PGUSER:', process.env.PGUSER);
console.log('PGHOST:', process.env.PGHOST);
console.log('PGDATABASE:', process.env.PGDATABASE);
console.log('PGPASSWORD:', process.env.PGPASSWORD);
console.log('PGPORT:', process.env.PGPORT);

if (!process.env.PGUSER || !process.env.PGHOST || !process.env.PGDATABASE || !process.env.PGPASSWORD || !process.env.PGPORT) {
  console.error('One or more environment variables are missing.');
  process.exit(1);
}

const init = async () => {
  try {
    await client.connect();
    console.log('connected to database');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('connection error:', error);
  }
};

init();