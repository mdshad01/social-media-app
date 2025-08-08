import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const getProfile = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id)
    .select("-password -otp -otpExpires -resetPasswordOTP -resetPasswordOTPExpires -passwordConfirm")
    .populate({
      path: "post",
      options: { sort: { createdAt: -1 } },
    })
    .populate({
      path: "savePosts",
      options: { sort: { createdAt: -1 } },
    });

  if (!user) {
    return next(new AppError("User Not Found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const editProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // Destructure all editable fields
  const { bio, city, school, work, website } = req.body;

  // Get uploaded images (from multer's req.files)
  const profilePicture = req.files?.profilePicture?.[0];
  const backgroundImage = req.files?.backgroundImage?.[0];

  let profilePictureUrl;
  let backgroundImageUrl;

  // Upload profile picture if available
  if (profilePicture) {
    const fileUri = await getDataUri(profilePicture);
    const cloudResponse = await uploadToCloudinary(fileUri);
    profilePictureUrl = cloudResponse.secure_url;
  }

  // Upload background image if available
  if (backgroundImage) {
    const fileUri = await getDataUri(backgroundImage);
    const cloudResponse = await uploadToCloudinary(fileUri);
    backgroundImageUrl = cloudResponse.secure_url;
  }

  const user = await User.findById(userId).select("-password");

  if (!user) return next(new AppError("User not found", 404));

  // Update fields conditionally
  if (bio) user.bio = bio;
  if (city) user.city = city;
  if (school) user.school = school;
  if (work) user.work = work;
  if (website) user.website = website;
  if (profilePictureUrl) user.profilePicture = profilePictureUrl;
  if (backgroundImageUrl) user.backgroundImage = backgroundImageUrl;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    data: {
      user,
    },
  });
});
