import express, { Router } from "express";
import { signup } from "../controllers/authController.js";

const userRouter = Router();

userRouter.post("/signup", signup);

export default userRouter;
