import mongoose from "mongoose";

const { Schema, model } = mongoose;

const issueSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  repo: { type: String, required: true },
  difficulty: { type: String, required: true },
  comments: { type: Number, required: true },
  url: { type: String, required: true },
  stars: { type: Number, default: 0 },
  language: { type: String, default: "" },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date },
});

export default model("issues", issueSchema);
