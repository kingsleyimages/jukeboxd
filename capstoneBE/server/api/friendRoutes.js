const express = require('express');
const router = express.Router();
const {
  createFriend,
  fetchAllFriends,
  fetchFriendsById,
  fetchReviewsByFriends,
  fetchAvailableFriends,
  deleteFriend,
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
router.get('/available/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const available = await fetchAvailableFriends(userId);
    res.send(available);
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

router.get('/reviews/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const allFriends = await fetchReviewsByFriends(userId);
    res.send(allFriends);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/delete', async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.body.userId;
    const friendId = req.body.friendId;
    const deletedFriend = await deleteFriend(userId, friendId);
    res.send(deletedFriend);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred while deleting the friend.');
  }
});

module.exports = router;
