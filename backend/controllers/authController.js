import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import generateOtp from "../utils/generateOtp.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import hbs from "handlebars";
import { fileURLToPath } from "url";
import sendEmail from "../utils/email.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadTemplate = (templateName, replacements) => {
  const templatePath = path.join(__dirname, "../emailTemplate", templateName);
  const source = fs.readFileSync(templatePath, "utf-8");
  const template = hbs.compile(source);
  return template(replacements);
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);
  const cookieOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res.cookie("jwt", token, cookieOption);
  user.password = undefined;
  user.otp = undefined;
  res.status(statusCode).json({
    status: "success",
    message,
    token,
    data: { user },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { username, email, passwordConfirm, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already registerd", 400));
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
  const htmlTemplate = loadTemplate("otpTemplate.hbs", {
    title: "Otp Verification",
    username: newUser.username,
    otp,
    message: "Your One Time Password (OTP) for account verification is : ",
  });

  try {
    await sendEmail({
      email: newUser.email,
      subject: "OTP for Email verification",
      html: htmlTemplate,
    });

    createSendToken(newUser, 200, res, "Registration Successful. Check your email for OTP Verification");
  } catch (error) {
    await User.findByIdAndDelete(newUser._id);
    return next(new AppError("There is an error to creating an account. Please try again later!", 500));
  }
});

export const verifyAccount = catchAsync(async (req, res, next) => {
  const { otp } = req.body;
  if (!otp) {
    return next(new AppError("Otp is required for verification", 400));
  }
  const user = req.user;
  if (user.otp !== otp) {
    return next(new AppError("Invalid Otp!", 400));
  }

  if (Date.now() > user.otpExpires) {
    return next(new AppError("Otp has expired. Please request new OTP", 400));
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res, "Email has been verified");
});

export const resendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.user;
  if (!email) {
    return next(new AppError("Email is required.", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("User not found!", 404));
  }

  if (user.isVerified) {
    return next(new AppError("THis account is already verified", 400));
  }

  const otp = generateOtp();
  const otpExpires = Date.now() + 24 * 60 * 60 * 1000;
  user.otp = otp;
  user.otpExpires = otpExpires;

  await user.save({ validateBeforeSave: false });

  const htmlTemplate = loadTemplate("otpTemplate.hbs", {
    title: "Otp Verification",
    username: user.username,
    otp,
    message: "Your One Time Password (OTP) for account verification is : ",
  });

  try {
    await sendEmail({
      email: user.email,
      subject: "Resend otp for email verification",
      html: htmlTemplate,
    });

    res.status(200).json({ status: "success", message: "New OTP is send to your email" });
  } catch (error) {
    (user.otp = undefined), (user.otpExpires = undefined), await user.save({ validateBeforeSave: false });
    return next(new AppError("There is an error sending email, Pleasr try again late!r", 500));
  }
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  createSendToken(user, 200, res, "Login Successful");
});

export const logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ status: "success", message: "Logged out successfully." });
});

export const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const otp = generateOtp();
  const resetExpires = Date.now() + 5 * 60 * 1000;

  user.resetPasswordOTP = otp;
  user.resetPasswordOTPExpires = resetExpires;

  await user.save({ validateBeforeSave: false });

  const htmlTemplate = loadTemplate("otpTemplate.hbs", {
    title: "Reset Password OTP",
    username: user.username,
    otp,
    message: "You reset password otp is",
  });

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset OTP (Valid for 5 minutes only)",
      html: htmlTemplate,
    });

    res.status(200).json({ status: "success", message: "Password reset otp send to your email" });
  } catch (error) {
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("There is an error sending email, Pleasr try again late!r", 500));
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { email, otp, password, passwordConfirm } = req.body;
  const user = await User.findOne({ email, resetPasswordOTP: otp, resetPasswordOTPExpires: { $gt: Date.now() } });

  if (!user) {
    return next(new AppError("No User Found", 400));
  }
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.resetPasswordOtp = undefined;
  user.resetPasswordOTPExpires = undefined;

  await user.save();

  createSendToken(user, 200, res, "Password Reset Successfully");
});

export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  const { email } = req.user;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("User Not Found", 404));
  }

  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError("Incorrect Password"), 400);
  }

  if (newPassword !== newPasswordConfirm) {
    return next(new AppError("New Password and confirm password are not match", 400));
  }

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  await user.save();

  createSendToken(user, 200, res, "Password changed successfully.");
});
