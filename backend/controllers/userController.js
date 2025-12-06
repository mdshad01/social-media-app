import cloudinary from "cloudinary";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import Comment from "../models/commentModel.js";

export const getProfile = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id)
    .select("-password -otp -otpExpires -resetPasswordOTP -resetPasswordOTPExpires -passwordConfirm")
    .populate({
      path: "posts",
      options: { sort: { createdAt: -1 } },
    })
    .populate({
      path: "savedPosts",
      options: { sort: { createdAt: -1 } },
      populate: {
        //  Add nested populate for user
        path: "user",
        select: "username profilePicture bio _id",
      },
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
  const { username,bio, city, school, work, website } = req.body;

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
  if(username) user.username = username;
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

export const suggestedUser = catchAsync(async (req, res, next) => {
  const loginUserID = req.user.id;

  const users = await User.find({ _id: { $ne: loginUserID } }).select(
    "-password -otp -otpExpires -resetPasswordOTP -resetPasswordOTPExpires -passwordConfirm"
  );

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

export const followUnfollow = catchAsync(async (req, res, next) => {
  const loginUserId = req.user._id;
  const targetUserId = req.params.id;

  if (loginUserId.toString() === targetUserId) {
    return next(new AppError("User can't follow/Unfollow it self", 400));
  }

  const targetUser = await User.findById(targetUserId);

  if (!targetUser) return next(new AppError("User not found", 404));

  const isFollowing = targetUser.followers.includes(loginUserId);

  if (isFollowing) {
    await Promise.all([
      User.updateOne({ _id: loginUserId }, { $pull: { following: targetUserId } }),
      User.updateOne({ _id: targetUserId }, { $pull: { followers: loginUserId } }),
    ]);
  } else {
    await Promise.all([
      User.updateOne({ _id: loginUserId }, { $addToSet: { following: targetUserId } }),
      User.updateOne({ _id: targetUserId }, { $addToSet: { followers: loginUserId } }),
    ]);
  }

  const updatedLoggedInUser = await User.findById(loginUserId).select("-password");

  res.status(200).json({
    status: "success",
    message: isFollowing ? "Unfollowed user" : "Followed user",
    data: {
      user: updatedLoggedInUser,
    },
  });
});

export const getMe = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError("User Not Authenticated", 404));

  res.status(200).json({
    status: "success",
    message: "Authenticated User",
    data: {
      user,
    },
  });
});

export const deactivateAccount  = catchAsync(async (req,res,next) => {
  const userId = req.user._id

  const user = await User.findById(userId);

  if(!user) return next(new AppError("User not found",404));

  // mark as delete
  user.isDeleted = true;
  user.deletionType = "soft";
  user.deletionScheduledAt = new Date();
  user.deletionExecuteAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await user.save({validateBeforeSave:true});

  res.status(200).json({
    status:"success",
    message:"Account deactivated. You have 30 days to reactivate.",
    data:{
      deletionExecuteAt:user.deletionExecuteAt,
    }
  })
});

export const deleteAccountPermanently = catchAsync(async (req,res,next) => {
  const userId = req.user._id;
  const {password} = req.body;

  const user = await User.findById(userId);
  if(!user) return next(new AppError("User not found",404));

  const isPasswordCorrect = await user.correctPassword(password, user.password);

  if(!isPasswordCorrect) {
    return next(new AppError("Incorrect passowrd"));
  }

  const userPosts = await Post.find({user:userId});

  
  for(const post of userPosts) {
    
    // delete image from cloudinary

    if(post.image?.publicId) {
      try {
        await cloudinary.v2.uploader.destroy(post.image.publicId);
      } catch (e) {
        console.error("Failed to delete image",e);
      }
    }
    
    // delete videos from cloudinary
    
    if(post.video?.publicId){
      try {
        await cloudinary.v2.uploader.destroy(post.video.publicId,{resource_type:"video"});
        
      } catch (error) {
        console.error("Failed to delete video", error);
      }
    }
  }

  // Delete all post
  await Post.deleteMany({user:userId});

  // Delete all user's comments
  await Comment.deleteMany({user:userId});

  // remove user from all post likes
  await Post.updateMany(
    {likes:{user:userId}},
    {$pull:{likes:userId}}
  );

  // remove user from all comments likes
  await Comment.updateMany(
    {likes:{user:userId}},
    {$pull:{likes:userId}}
  );

  // Remove user from followers/following relationships

  await User.updateMany(
    {followers:userId},
    {$pull:{followers:userId}}
  );

  await User.updateMany(
    {following:userId},
    {$pull:{following:userId}}
  );

  // Remove user from saved posts

  await User.updateMany(
    {savedPosts:{$in:user.posts}},
    {$pull:{savedPosts:{$in:user.posts}}}
  );

  // Delete User's profile and background image from cloudinary
  if(user.profilePicture) {
   try {
      // Extract publicId from URL if needed
      const publicId = user.profilePicture.split("/").pop().split(".")[0];
      await cloudinary.v2.uploader.destroy(publicId);
    } catch (error) {
      console.error("Failed to delete profile picture:", error);
    }
  }
  
  if (user.backgroundImage) {
    try {
      const publicId = user.backgroundImage.split("/").pop().split(".")[0];
      await cloudinary.v2.uploader.destroy(publicId);
    } catch (error) {
      console.error("Failed to delete background image:", error);
    }
  }

  // Finally, delete the user
  await User.findByIdAndDelete(userId);

  res.status(200).json({
    status: "success",
    message: "Account permanently deleted",
  });

})


export const reactivateAccount = catchAsync(async (req,res,next) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if(!user) return next(new AppError("User not found", 404));

  if(!user.isDeleted || user.deletionType !== "soft") {
    return next(new AppError("Account is not deactivated",400));
  }

  // check if 30 days have passed

  if(new Date() > user.deletionExecuteAt) return next(new AppError("Recovery period has expired",400));

  // Reactivate account
  user.isDeleted = false;
  user.deletionType = null;
  user.deletionScheduledAt = null;
  user.deletionExecuteAt = null;

  await User.save({validateBeforeSave:false});

    res.status(200).json({
    status: "success",
    message: "Account reactivated successfully",
    data: { user },
  });

});