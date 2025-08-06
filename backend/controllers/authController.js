import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import generateOtp from "../utils/generateOtp.js";

export const signup = catchAsync(async (req, res, next) => {
  const { username, email, passwordConfirm, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(AppError("Email already register", 400));
  }
  const otp = generateOtp();
  const otpExpires = Date.now() + 24 * 60 * 60 * 1000;
  const newUser = await User.create({
    username,
    email,
    password,
    passwordConfirm,
    otp,
    otpExpires,
  });

  res.status(200).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
    },
  });
});
