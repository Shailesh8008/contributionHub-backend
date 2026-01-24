import mongoose from "mongoose";

const { Schema, model } = mongoose;

const bookmarkSchema = new Schema({
  userId: { type: Number, required: true },
  issues: [],
});

export default model("bookmarks", bookmarkSchema);
