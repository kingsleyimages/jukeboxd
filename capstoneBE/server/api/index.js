const express = require('express');
const router = express.Router();

router.use('/users', require('./userRoutes.js'));
router.use('/reviews', require('./reviewRoutes.js'));
router.use('/albums', require('./albumRoutes.js'));

// localhost:3000/api/
// router.get('/', (req, res) => {
//   res.send('Hello World From Router api/index.js');
// });

module.exports = router;
