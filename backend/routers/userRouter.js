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

const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/verify", isAuthenticated, verifyAccount);
userRouter.post("/resend-otp", isAuthenticated, resendOtp);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/forget-password", forgetPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/change-password", isAuthenticated, changePassword);

export default userRouter;
