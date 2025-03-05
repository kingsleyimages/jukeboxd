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
  getAllComments,
  fetchCommentbyCommentId,
} = require("../db/comments.js");
const { authenticateToken, adminAuth } = require("./middlewares.js");

// base route and return for the api for comments

// /api/comments

// create a comment for a review
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

// fetch comment by id
router.get("/:id/", async (req, res, next) => {
  try {
    const comment = await fetchCommentById(req.params.id);
    res.send(comment);
  } catch (error) {
    next(error);
  }
});

// fetch all comments
router.get("/", async (req, res, next) => {
  try {
    const comments = await fetchComments();
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

// fetch all comments for a review
router.get("/review/:reviewId/comments", async (req, res, next) => {
  try {
    const comments = await fetchCommentsByReviewId(req.params.reviewId);
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

// fetch all comments by a user
router.get("/user/:userId/", async (req, res, next) => {
  try {
    const comments = await fetchCommentsByUserId(req.params.userId);
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

// delete a comment by id (non-admin)
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

// delete a comment by id (admin only)
router.delete(
  "/admin/:id/delete",
  authenticateToken,
  adminAuth,
  async (req, res, next) => {
    try {
      const response = await deleteComment(req.params.id);
      res
        .status(200)
        .send({ message: "Comment deleted successfully", comment: response });
    } catch (error) {
      next(error);
    }
  }
);

// update a comment by id (non-admin)
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
