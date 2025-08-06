import mongoose, { Schema } from "mongoose";
import validator from "validator";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please add username"],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please Confirm your password"],
      minlength: 8,
      select: false,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Password not match",
      },
    },
    profilePicture: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 256,
      default: "",
    },
    backgroundImage: {
      type: String,
    },
    city: {
      type: String,
    },
    school: {
      type: String,
    },
    work: {
      type: String,
    },
    website: {
      type: String,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    savedPost: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    resetPasswordOTPExpire: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.user || mongoose.model("User", UserSchema);
export default User;
