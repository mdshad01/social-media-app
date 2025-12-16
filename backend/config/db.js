import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync";

const connectDB = async () => {
  try {
    mongoose
      .connect(process.env.DB)
      .then(() => {
        console.log("Database connected successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
