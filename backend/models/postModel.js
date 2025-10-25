import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    postType: {
      type: String,
      enum: ["image", "video", "poll", "event", "text"],
      default: "image", // ✅ Default to "image" for existing posts
    },

    caption: {
      type: String,
      maxlength: [2200, "Caption should be less than 2200 characters"],
      trim: true,
    },

    // ✅ KEEP OLD FIELD for backward compatibility
    image: {
      url: { type: String },
      publicId: { type: String },
    },

    // ✅ NEW FIELD for videos
    video: {
      url: { type: String },
      publicId: { type: String },
    },

    // For poll posts
    poll: {
      question: String,
      options: [
        {
          text: String,
          votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        },
      ],
      expiresAt: Date,
    },

    // For event posts
    event: {
      title: { type: String },
      date: { type: Date },
      time: { type: String },
      location: { type: String },
      attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID required"],
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    share: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

postSchema.index({ user: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
