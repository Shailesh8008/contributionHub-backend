import mongoose from "mongoose";
import { env } from "./env";

const connectDB = async () => {
  try {
    await mongoose.connect(env.DB);
    console.log("DB connected successfully!");
  } catch (error) {
    console.log(error);
    console.log("Failed to connect to DB!");
  }
};

export default connectDB;
