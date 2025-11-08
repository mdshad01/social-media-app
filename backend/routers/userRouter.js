import express, { Router } from "express";
import {
  changePassword,
  forgetPassword,
  login,
  logout,
  resendOtp,
  resetPassword,
  signup,
  verifyAccount,
} from "../controllers/authController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { editProfile, followUnfollow, getMe, getProfile, suggestedUser } from "../controllers/userController.js";
import upload from "../middleware/multer.js";
import { getActivity } from "../controllers/activityController.js";

const userRouter = Router();
// Auth routes
userRouter.post("/signup", signup);
userRouter.post("/verify", isAuthenticated, verifyAccount);
userRouter.post("/resend-otp", isAuthenticated, resendOtp);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/forget-password", forgetPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/change-password", isAuthenticated, changePassword);

// User routes

userRouter.get("/profile/:id", getProfile);
userRouter.post(
  "/edit-profile",
  isAuthenticated,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },
  ]),
  editProfile
);

userRouter.get("/suggested-user", isAuthenticated, suggestedUser);
userRouter.post("/follow-unfollow/:id", isAuthenticated, followUnfollow);
userRouter.get("/me", isAuthenticated, getMe);
userRouter.get("/activity",isAuthenticated,getActivity);

export default userRouter;
