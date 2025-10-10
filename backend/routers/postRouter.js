import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";
import {
  addComment,
  createPost,
  deletePost,
  getAllPosts,
  getUserPost,
  likeOrDislikePost,
  saveOrUnsavePost,
} from "../controllers/postController.js";

const postRouter = express.Router();

// routers
postRouter.post("/create-post", isAuthenticated, upload.single("image"), createPost);
postRouter.get("/all", getAllPosts);
postRouter.get("/user-post/:id", getUserPost);
postRouter.post("/save-unsave-post/:postId", isAuthenticated, saveOrUnsavePost);
postRouter.delete("/detele-post/:id", isAuthenticated, deletePost);
postRouter.post("/like-dislike/:id", isAuthenticated, likeOrDislikePost);
postRouter.post("/comment/:id", isAuthenticated, addComment);

export default postRouter;
