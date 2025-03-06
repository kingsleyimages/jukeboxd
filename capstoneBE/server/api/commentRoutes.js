const express = require("express");
const router = express.Router();
const {
  createComment,
  fetchCommentById,
  fetchCommentsByReviewId,
  fetchCommentsByUserId,
  fetchComments,
  deleteComment,
  updateComment,
  fetchCommentbyCommentId,
} = require("../db/comments.js");
const { authenticateToken } = require("./middlewares.js");

router.post(
  "/review/:reviewId/create",
  authenticateToken,
  async (req, res, next) => {
    console.log("route logic");
    try {
      console.log(req.body);
      const comment = await createComment(
        req.params.reviewId,
        req.user.id,
        req.body.text
      );

      res.status(201).send(comment);
    } catch (error) {
      next(error);
    }
  }
);


router.get("/:id/", async (req, res, next) => {
  try {
    const comment = await fetchCommentById(req.params.id);
    res.send(comment);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const comments = await fetchComments();
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

router.get("/review/:reviewId/comments", async (req, res, next) => {
  try {
    const comments = await fetchCommentsByReviewId(req.params.reviewId);
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

router.get("/user/:userId/", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).send("User ID is required");
    }
    const comments = await fetchCommentsByUserId(userId);
    res.send(comments);
  } catch (error) {
    next(error);
  }
});


router.delete("/:id/delete", authenticateToken, async (req, res, next) => {
  try {
    const comment = await fetchCommentbyCommentId(req.params.id);
    console.log(comment, req.user.id);
    if (comment[0].user_id != req.user.id) {
      return res
        .status(401)
        .send("You are not authorized to delete this comment");
    }
    const response = await deleteComment(req.params.id);
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});




router.put("/:id/update", authenticateToken, async (req, res, next) => {
  try {
    const comments = await fetchCommentsByUserId(req.user.id);
    const comment = comments.find((comment) => comment.id === req.params.id);
    if (!comment || comment.user.id !== req.user.id) {
      return res
        .status(401)

        .send("You are not authorized to update this comment");
    }
    const response = await updateComment(req.params.id, req.body.comment);
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});



module.exports = router;
