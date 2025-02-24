const express = require('express');
const router = express.Router();
const {
  createFriend,
  fetchAllFriends,
  fetchFriendsById,
} = require('../db/friends.js');

// create a friend relationship between two users
router.post('/add', async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    const newFriend = await createFriend(userId, friendId);
    res.send(newFriend);
  } catch (error) {
    console.log(error);
  }
});

router.get('/all', async (req, res) => {
  try {
    const allFriends = await fetchAllFriends();
    res.send(allFriends);
  } catch (error) {
    console.log(error);
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const friends = await fetchFriendsById(userId);
    res.send(friends);
  } catch (error) {
    console.log(error);
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFriend = await deleteFriend(id);
    res.send(deletedFriend);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
