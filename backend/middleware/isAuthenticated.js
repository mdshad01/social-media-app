import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";

const isAuthenticated = catchAsync(async (req, res, next) => {
  // ✅ Get token from cookies or headers
  const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return next(new AppError("You are not logged in! Please log in to access", 401));
  }

  // ✅ Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  // ✅ Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("The user belonging to this token does not exist.", 401));
  }

  // ✅ Check if account is deleted
  if (currentUser.isDeleted && !req.path.includes('/reactivate-account')) {
    return next(new AppError("This account has been deactivated", 403));
  }

  // ✅ NEW: Check if user is verified (except for verification routes)
  const verificationRoutes = ['/verify', '/resend-otp'];
  const isVerificationRoute = verificationRoutes.some(route => req.path.includes(route));
  
  if (!currentUser.isVerified && !isVerificationRoute) {
    return next(new AppError("Please verify your email to access this resource", 403));
  }

  // ✅ Attach user to request
  req.user = currentUser;
  next();
});

export default isAuthenticated;
