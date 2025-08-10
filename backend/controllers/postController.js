import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import sharp from "sharp";
import { uploadToCloudinary } from "../utils/cloudinary";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";

export const createPost = catchAsync(async (req, res, next) => {
  const { caption } = req.body;
  const image = req.file;
  const userId = req.user._id;

  if (!req.user || !req.user._id) {
    return next(new AppError("User not authenticated", 401));
  }

  if (!image) return next(new AppError("Image is required for post", 400));

  // optimize our image
  const optimizedImageBuffer = await sharp(image.buffer)
    .resize({ width: 800, height: 800, fit: "inside" })
    .toFormat("jpeg", { quality: 90 })
    .toBuffer();

  const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;

  const cloudResponse = await uploadToCloudinary(fileUri);

  let post = await Post.create({
    caption,
    image: {
      url: cloudResponse.secure_url,
      publicId: cloudResponse.public_id,
    },
    user: userId,
  });

  //   add post to users posts
  const user = req.user;
  //   const user = await User.findById(userId);

  if (user) {
    user.posts.push(post._id);
    await user.save({ validateBeforeSave: false });
  }

  post = await post.populate({
    path: "user",
    // select: "username bio email profilePicture backgroundImage city school work website",
    select: "username bio email profilePicture ",
  });

  return res.status(200).json({
    status: "success",
    message: "Post Created",
    data: {
      post,
    },
  });
});

export const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find()
    .populate({
      path: "user",
      select: "username profilePicture bio",
    })
    .populate({
      path: "comments",
      select: "text user",
      populate: {
        path: "user",
        select: "username profilePicture",
      },
    })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts,
    },
  });
});

export const getUserPost = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const posts = await Post.find({ user: userId })
    .populate({
      path: "user", // populate post owner
      select: "username profilePicture bio",
    })
    .populate({
      path: "comments",
      select: "text user",
      populate: {
        path: "user",
        select: "username profilePicture",
      },
    })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    status: "success",
    result: posts.length,
    data: {
      posts,
    },
  });
});

export const saveOrUnsavePost = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const postId = req.params.id;

  const user = await User.findById(userId);
  if (!user) return next(new AppError("User not found", 404));

  const post = await Post.findById(postId);
  if (!post) return next(new AppError("Post not found", 404));

  const isPostSave = await user.savedPosts.includes(postId);

  if (isPostSave) {
    user.savedPosts.pull(postId);
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({
      status: "success",
      message: "Removed from saved post",
      data: { savedPosts: user.savedPosts },
    });
  } else {
    user.savedPosts.push(postId);
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      status: "success",
      message: "Post saved successfully",
      data: { savedPosts: user.savedPosts },
    });
  }
});
