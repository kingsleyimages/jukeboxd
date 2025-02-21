const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByUsername, createUser } = require('../db/user'); // Correct import
const router = express.Router();
const { client } = require("../db/index.js");

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// User login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log('Login request received:', { username, password });

    try {
        const user = await getUserByUsername(username);
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        console.log('User found:', user);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Invalid password');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User registration route
router.post('/register', async (req, res, next) => {
    try {
        const response = await createUser(
            req.body.username,
            req.body.email,
            req.body.password,
            req.body.role
        );

        res.status(201).send(response);
    } catch (error) {
        next(error);
    }
});

// Token authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token is missing or invalid' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Access token is invalid' });
        }
        req.user = user;
        next();
    });
};

module.exports = router;
module.exports.authenticateToken = authenticateToken;
