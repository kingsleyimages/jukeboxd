const express = require('express');
const router = express.Router();

// we use the router.use() method to use the routes defined in the other route files
// this also sets the base path for the routes in those files
router.use('/users', require('./userRoutes.js'));
router.use('/reviews', require('./reviewRoutes.js'));
router.use('/albums', require('./albumRoutes.js'));
router.use('/comments', require('./commentRoutes.js'));
router.use('/friends', require('./friendRoutes.js'));
router.use('/favorites', require('./favoriteRoutes.js'));

// localhost:3000/api/ -> base route and return for the api
router.get('/', (req, res) => {
  res.send('Hello World From Router api/index.js');
});

module.exports = router;
