import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["text", "code", "quote"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const postsSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    lang: {
      type: String,
      required: true,
    },
    content: [contentSchema],
    tags: [
      {
        tag: {
          type: String,
          required: true,
        },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Posts = mongoose.model("Posts", postsSchema);

export default Posts;
