import express, { Router } from "express";
import { signup, verifyAccount } from "../controllers/authController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/verify", isAuthenticated, verifyAccount);

export default userRouter;
