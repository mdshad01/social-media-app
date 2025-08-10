import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import sharp from "sharp";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import cloudinary from "cloudinary";
import Comment from "../models/commentModel.js";

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
  const postId = req.params.postId;

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

export const deletePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(id).populate("user");

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  if (post.user._id.toString() !== userId.toString()) {
    return next(new AppError("You are not authorized to delete this post", 403));
  }

  // remove the post from posts
  await User.updateOne({ _id: userId }, { $pull: { posts: id } });

  // delete this post from user save list
  await User.updateMany({ savedPosts: id }, { $pull: { savedPosts: id } });

  // remove the comment of this post
  await Comment.deleteMany({ post: id });

  //remove image from cloudinary

  if (post.image.publicId) {
    await cloudinary.uploader.destroy(post.image.publicId);
  }

  // remover the post

  await Post.findByIdAndDelete(id);

  res.status(200).json({
    status: "success",
    message: "Post deleted successfully",
  });
});

export const likeOrDislikePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(id);

  if (!post) return next(new AppError("Post not found", 404));

  const isLiked = post.likes.includes(userId);

  if (isLiked) {
    await Post.findByIdAndUpdate(id, { $pull: { likes: userId } }, { new: true });

    res.status(200).json({
      status: "success",
      message: "Post disliked successfully",
    });
  } else {
    await Post.findByIdAndUpdate(id, { $addToSet: { likes: userId } }, { new: true });
    res.status(200).json({
      status: "success",
      message: "Post Liked successfully",
    });
  }
});

export const addComment = catchAsync(async (req, res, next) => {
  const { id: postId } = req.params;
  const userId = req.user._id;

  const { text } = req.body;

  const post = await Post.findById(postId);

  if (!post) return next(new AppError("Post not found", 404));
  if (!text) return next(new AppError("Comment text is required", 400));

  const comment = await Comment.create({
    text,
    user: userId,
  });

  post.comments.push(comment._id);
  await post.save({ validateBeforeSave: false });

  await comment.populate({
    path: "user",
    select: "username profilePicture bio",
  });

  res.status(200).json({
    status: "success",
    message: "comment added successfully",
    data: {
      comment,
    },
  });
});
