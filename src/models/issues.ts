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
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date },
});

export default model("issues", issueSchema);
