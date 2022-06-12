import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const Post = new Schema(
  {
    title: {
      type: String,
      required: 'Title is missing'
    },
    author: {
      type: String,
      ref: 'User',
      required: 'Author is missing',
      immutable: true
    },
    post: {
      type: String,
      required: 'Content is missing'
    }
  },
  { timestamps: true }
);

export default model('Post', Post);
