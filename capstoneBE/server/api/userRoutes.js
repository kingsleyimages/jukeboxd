const express = require('express');
const router = express.Router();

const { fetchUsers } = require('../db/user.js');

router.get('/', (req, res, next) => {
  res.send(['user1', 'user2', 'user3']);
});

module.exports = router;
