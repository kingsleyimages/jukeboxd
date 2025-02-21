// server/api/index.js

const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes.js');
const reviewRoutes = require('./reviewRoutes.js');

router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;

// localhost:3000/api/
// router.get('/', (req, res) => {
//   res.send('Hello World From Router api/index.js');
// });