const express = require('express');
const router = express.Router();


const { createUser } = require('../db/user.js');

router.post('/', async (req, res, next) => {
  console.log(req.body)
  try {
    const review = await createUser(
      req.body.username,
      req.body.password,
      req.body.role
    );

    res.status(201).send(review);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
