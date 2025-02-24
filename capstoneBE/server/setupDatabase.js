require('dotenv').config();
const { client, createTables } = require('./db/index.js');

const setupDatabase = async () => {
  try {
    await client.connect();
    await createTables();
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.end();
  }
};

setupDatabase();