import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const isVerified = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }

  if (!req.user.isVerified) {
    return next(new AppError("Please verify your email to access this resource", 403));
  }

  next();
});

export default isVerified;
