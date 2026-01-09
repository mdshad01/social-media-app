import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isVerified from "../middleware/isVerified.js"; // ✅ Import new middleware
import upload from "../middleware/multer.js";
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  getAllPosts,
  getSinglePost,
  getUserPost,
  likeOrDislikeComment,
  likeOrDislikePost,
  replyToComment,
  rsvpToEvent,
  saveOrUnsavePost,
  sharePost,
  voteOnPoll,
} from "../controllers/postController.js";

const postRouter = express.Router();

// ✅ All post routes require authentication + verification
postRouter.post("/create-post", isAuthenticated, isVerified, upload.single("image"), createPost);
postRouter.post("/poll/vote", isAuthenticated, isVerified, voteOnPoll);
postRouter.post("/event/rsvp/:postId", isAuthenticated, isVerified, rsvpToEvent);
postRouter.get("/all", isAuthenticated, isVerified, getAllPosts);
postRouter.get("/single/:id", isAuthenticated, isVerified, getSinglePost);
postRouter.get("/user-post/:id", isAuthenticated, isVerified, getUserPost);
postRouter.post("/save-unsave-post/:postId", isAuthenticated, isVerified, saveOrUnsavePost);
postRouter.delete("/delete-post/:id", isAuthenticated, isVerified, deletePost);
postRouter.post("/like-dislike/:id", isAuthenticated, isVerified, likeOrDislikePost);
postRouter.post("/comment/:id", isAuthenticated, isVerified, addComment);
postRouter.post("/comment/like/:commentId", isAuthenticated, isVerified, likeOrDislikeComment);
postRouter.post("/comment/reply/:commentId", isAuthenticated, isVerified, replyToComment);
postRouter.delete("/comment/:commentId", isAuthenticated, isVerified, deleteComment);
postRouter.post("/share/:id", isAuthenticated, isVerified, sharePost);

export default postRouter;
