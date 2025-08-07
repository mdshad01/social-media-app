import express, { Router } from "express";
import { resendOtp, signup, verifyAccount } from "../controllers/authController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/verify", isAuthenticated, verifyAccount);
userRouter.post("/resend-otp", isAuthenticated, resendOtp);

export default userRouter;
