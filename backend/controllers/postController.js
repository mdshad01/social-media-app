import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import sharp from "sharp";
import { uploadToCloudinary, uploadVideoToCloudinary } from "../utils/cloudinary.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import cloudinary from "cloudinary";
import Comment from "../models/commentModel.js";

export const createPost = catchAsync(async (req, res, next) => {
  const { caption, postType, pollData, eventData } = req.body;
  const file = req.file;
  const userId = req.user._id;

  if (!req.user || !req.user._id) {
    return next(new AppError("User not authenticated", 401));
  }

  console.log("Received postType:", postType);
  console.log("File info:", file ? { name: file.originalname, size: file.size, type: file.mimetype } : "No file");
  let postData = {
    caption,
    postType: postType || "text",
    user: userId,
  };

  // ✅ Handle IMAGE
  if (postType === "image" || (!postType && file)) {
    if (!file) return next(new AppError("Image is required", 400));

    const optimizedImageBuffer = await sharp(file.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 90 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
    const cloudResponse = await uploadToCloudinary(fileUri);

    postData.image = {
      url: cloudResponse.secure_url,
      publicId: cloudResponse.public_id,
    };
    postData.postType = "image";
  }

  // ✅ Handle VIDEO - OPTIMIZED VERSION
  if (postType === "video") {
    if (!file) return next(new AppError("Video file is required", 400));

    try {
      console.log("Uploading video:", file.originalname, "Size:", (file.size / 1024 / 1024).toFixed(2), "MB");

      // Upload using stream (no base64 conversion = faster)
      const cloudResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "posts/videos",
            timeout: 300000, // 5 minutes
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary error:", error);
              reject(error);
            } else {
              console.log("Upload successful:", result.public_id);
              resolve(result);
            }
          }
        );

        // Write buffer to stream
        uploadStream.end(file.buffer);
      });

      postData.video = {
        url: cloudResponse.secure_url,
        publicId: cloudResponse.public_id,
      };
      postData.postType = "video";
    } catch (error) {
      console.error("Video upload failed:", error);
      return next(new AppError("Failed to upload video. Please try again.", 500));
    }
  }

  // ✅ Handle POLL
  if (postType === "poll") {
    const parsedPollData = typeof pollData === "string" ? JSON.parse(pollData) : pollData;

    if (!parsedPollData || !parsedPollData.options || parsedPollData.options.length < 2) {
      return next(new AppError("Poll must have at least 2 options", 400));
    }

    postData.poll = {
      question: parsedPollData.question || caption,
      options: parsedPollData.options.map((opt) => ({ text: opt, votes: [] })),
      expiresAt: parsedPollData.expiresAt || null,
    };
    postData.postType = "poll";
  }

  // ✅ Handle EVENT
  if (postType === "event") {
    const parsedEventData = typeof eventData === "string" ? JSON.parse(eventData) : eventData;

    if (!parsedEventData || !parsedEventData.title || !parsedEventData.date) {
      return next(new AppError("Event must have title and date", 400));
    }

    postData.event = {
      title: parsedEventData.title,
      date: new Date(parsedEventData.date),
      time: parsedEventData.time,
      location: parsedEventData.location,
      attendees: [],
    };
    postData.postType = "event";
  }

  let post = await Post.create(postData);

  const user = req.user;
  if (user) {
    user.posts.push(post._id);
    await user.save({ validateBeforeSave: false });
  }

  post = await post.populate({
    path: "user",
    select: "username bio email profilePicture",
  });

  return res.status(200).json({
    status: "success",
    message: "Post Created",
    data: { post },
  });
});

// Vote on poll
export const voteOnPoll = catchAsync(async (req, res, next) => {
  const { postId, optionIndex } = req.body;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post || post.postType !== "poll") {
    return next(new AppError("Poll not found", 404));
  }

  // Remove previous vote if exists
  post.poll.options.forEach((option) => {
    option.votes = option.votes.filter((id) => id.toString() !== userId.toString());
  });

  // Add new vote
  post.poll.options[optionIndex].votes.push(userId);
  await post.save();

  res.status(200).json({
    status: "success",
    message: "Vote recorded",
    data: { poll: post.poll },
  });
});

// RSVP to event
export const rsvpToEvent = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post || post.postType !== "event") {
    return next(new AppError("Event not found", 404));
  }

  const isAttending = post.event.attendees.includes(userId);

  if (isAttending) {
    post.event.attendees = post.event.attendees.filter((id) => id.toString() !== userId.toString());
    await post.save();
    return res.status(200).json({
      status: "success",
      message: "RSVP cancelled",
      data: { attendees: post.event.attendees },
    });
  } else {
    post.event.attendees.push(userId);
    await post.save();
    return res.status(200).json({
      status: "success",
      message: "RSVP confirmed",
      data: { attendees: post.event.attendees },
    });
  }
});

export const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find()
    .populate({
      path: "user",
      select: "username profilePicture bio",
    })
    .populate({
      path: "comments",
      select: "text user likes replies createdAt",
      populate: [
        {
          path: "user",
          select: "username profilePicture",
        },
        {
          path: "replies",
          select: "text user likes createdAt",
          populate: {
            path: "user",
            select: "username profilePicture",
          },
        },
      ],
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

  console.log(userId, postId);

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
      data: { user },
    });
  } else {
    user.savedPosts.push(postId);
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      status: "success",
      message: "Post saved successfully",
      data: { user },
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

  // Remove post from user's posts array
  await User.updateOne({ _id: userId }, { $pull: { posts: id } });

  // Remove post from all users' saved posts
  await User.updateMany({ savedPosts: id }, { $pull: { savedPosts: id } });

  // Delete all comments associated with this post
  await Comment.deleteMany({ post: id });

  // ✅ Delete image from Cloudinary
  if (post.image?.publicId) {
    try {
      await cloudinary.v2.uploader.destroy(post.image.publicId);
      console.log("Image deleted from Cloudinary:", post.image.publicId);
    } catch (error) {
      console.error("Failed to delete image from Cloudinary:", error);
      // Continue with post deletion even if Cloudinary fails
    }
  }

  // ✅ Delete video from Cloudinary
  if (post.video?.publicId) {
    try {
      await cloudinary.v2.uploader.destroy(post.video.publicId, { resource_type: "video" });
      console.log("Video deleted from Cloudinary:", post.video.publicId);
    } catch (error) {
      console.error("Failed to delete video from Cloudinary:", error);
      // Continue with post deletion even if Cloudinary fails
    }
  }

  // Delete the post from database
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
    post:postId
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

// Like/Unlike Comment
export const likeOrDislikeComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);
  if (!comment) return next(new AppError("Comment not found", 404));

  const isLiked = comment.likes.includes(userId);

  if (isLiked) {
    comment.likes = comment.likes.filter((id) => id.toString() !== userId.toString());
    await comment.save();

    return res.status(200).json({
      status: "success",
      message: "Comment unliked",
      data: { likes: comment.likes },
    });
  } else {
    comment.likes.push(userId);
    await comment.save();

    return res.status(200).json({
      status: "success",
      message: "Comment liked",
      data: { likes: comment.likes },
    });
  }
});

// Reply to Comment
export const replyToComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const { text } = req.body;
  const userId = req.user._id;

  if (!text) return next(new AppError("Reply text is required", 400));

  const parentComment = await Comment.findById(commentId);
  if (!parentComment) return next(new AppError("Comment not found", 404));

  // Create reply
  const reply = await Comment.create({
    text,
    user: userId,
    post: parentComment.post,
    parentComment: commentId,
  });

  // Add reply to parent comment
  parentComment.replies.push(reply._id);
  await parentComment.save();

  // Populate user data
  await reply.populate({
    path: "user",
    select: "username profilePicture bio",
  });

  res.status(200).json({
    status: "success",
    message: "Reply added successfully",
    data: { reply },
  });
});

// Delete Comment
export const deleteComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);
  if (!comment) return next(new AppError("Comment not found", 404));

  // Check if user owns the comment
  if (comment.user.toString() !== userId.toString()) {
    return next(new AppError("You can only delete your own comments", 403));
  }

  // Remove comment from post
  await Post.updateOne({ _id: comment.post }, { $pull: { comments: commentId } });

  // Delete all replies
  await Comment.deleteMany({ parentComment: commentId });

  // Delete the comment
  await Comment.findByIdAndDelete(commentId);

  res.status(200).json({
    status: "success",
    message: "Comment deleted successfully",
  });
});
