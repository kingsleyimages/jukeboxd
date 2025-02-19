require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { client } = require('./server/db/index.js');
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use('/api', require('./server/api'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

const init = async () => {
  try {
    await client.connect();
    console.log('connected to database', client);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('connection error:', error);
  }
};
init();
