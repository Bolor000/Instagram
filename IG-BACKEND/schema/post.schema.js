import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
  // userID: { type: Schema.Types.ObjectId, ref: "users", required: true },
  caption: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, required: true }],
  images: { type: [{ type: String, required: true }], required: true },
  createdAt: { type: Date, default: Date.now() },
  updateAt: { type: Date, default: Date.now() },
});

export const postModel = mongoose.model("post", postSchema);
