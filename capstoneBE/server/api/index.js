const express = require('express');
const router = express.Router();

// Use the routes defined in the other route files
router.use('/users', require('./userRoutes.js'));
router.use('/reviews', require('./reviewRoutes.js'));
router.use('/albums', require('./albumRoutes.js'));
router.use('/comments', require('./commentRoutes.js'));
router.use('/friends', require('./friendRoutes.js'));
router.use('/favorites', require('./favoriteRoutes.js'));

// Base route for the API
router.get('/', (req, res) => {
  res.send('Hello World From Router api/index.js');
});

module.exports = router;
