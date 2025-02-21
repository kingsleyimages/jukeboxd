require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const { createTables } = require('./server/db/index');
const userRoutes = require('./server/api/userRoutes'); // Import userRoutes

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
app.use('/api/user', userRoutes); // Register userRoutes with the base path '/api/user'

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
