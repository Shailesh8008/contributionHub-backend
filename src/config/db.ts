import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB!);
    console.log("DB connected successfully!");
  } catch (error) {
    console.log(error);
    console.log("Failed to connect to DB!");
  }
};

export default connectDB;
