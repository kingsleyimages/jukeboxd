require('dotenv').config();
const { client } = require('./server/db/index.js');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/api', require('./server/api'));
//error middleware
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
