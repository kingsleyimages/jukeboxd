require('dotenv').config();
console.log("PGUSER:", process.env.PGUSER);
console.log("PGPASSWORD:", process.env.PGPASSWORD ? "****" : "undefined");
console.log("PGHOST:", process.env.PGHOST);
console.log("PGDATABASE:", process.env.PGDATABASE);
console.log("PGPORT:", process.env.PGPORT);

const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

// API Routes
app.use('/api', require('./server/api'));

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Initialize and start server
const init = async () => {
    try {
        await pool.connect();
        console.log('Connected to the database');
        await createTables();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('connection error:', error);
    }
};

init();
