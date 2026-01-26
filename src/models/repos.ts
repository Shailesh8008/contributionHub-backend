import mongoose from "mongoose";

const { Schema, model } = mongoose;

const repoSchema = new Schema({
  fullName: { type: String, required: true },
  stars: { type: Number, required: true },
  language: { type: String, required: true },
  lastSynced: { type: Date, required: true },
});

export default model("repos", repoSchema);
