import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  id: { type: Number, required: true },
  username: { type: String, required: true },
  email: { type: String },
  name: { type: String },
  location: { type: String },
  avatar_url: { type: String },
});

export default model("cHubUsers", userSchema);
