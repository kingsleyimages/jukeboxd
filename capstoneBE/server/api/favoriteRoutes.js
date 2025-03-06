const express = require('express');
const router = express.Router();
const {
  fetchFavoritesByUser,
  fetchFriendFavorites,
} = require('../db/favorites.js');


router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await fetchFavoritesByUser(userId);
    res.send(favorites);
  } catch (error) {
    console.log(error);
  }
});

router.get('/friends/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await fetchFriendFavorites(userId);
    res.send(favorites);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
