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
import isVerified from "../middleware/isVerified.js"; // ✅ Import new middleware
import { 
  deactivateAccount, 
  deleteAccountPermanently, 
  editProfile, 
  followUnfollow, 
  getMe, 
  getProfile, 
  reactivateAccount, 
  suggestedUser 
} from "../controllers/userController.js";
import upload from "../middleware/multer.js";
import { getActivity } from "../controllers/activityController.js";

const userRouter = Router();

// ✅ Auth routes (no verification needed)
userRouter.post("/signup", signup);
userRouter.post("/verify", isAuthenticated, verifyAccount); // Only needs authentication
userRouter.post("/resend-otp", isAuthenticated, resendOtp); // Only needs authentication
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/forget-password", forgetPassword);
userRouter.post("/reset-password", resetPassword);

// ✅ Protected routes (need authentication + verification)
userRouter.post("/change-password", isAuthenticated, isVerified, changePassword);
userRouter.get("/profile/:id", isAuthenticated, isVerified, getProfile);
userRouter.post(
  "/edit-profile",
  isAuthenticated,
  isVerified,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },
  ]),
  editProfile
);
userRouter.get("/suggested-user", isAuthenticated, isVerified, suggestedUser);
userRouter.post("/follow-unfollow/:id", isAuthenticated, isVerified, followUnfollow);
userRouter.get("/me", isAuthenticated, isVerified, getMe);
userRouter.get("/activity", isAuthenticated, isVerified, getActivity);
userRouter.post("/deactivate-account", isAuthenticated, isVerified, deactivateAccount);
userRouter.delete("/delete-account", isAuthenticated, isVerified, deleteAccountPermanently);
userRouter.post("/reactivate-account", isAuthenticated, reactivateAccount);

export default userRouter;
