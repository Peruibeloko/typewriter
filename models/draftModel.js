import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const Draft = new Schema(
  {
    lastUpdated: {
      type: Number,
      default: Date.now
    },
    title: {
      type: String
    },
    author: {
      type: String,
      ref: 'User',
      required: 'Author is missing',
      immutable: true
    },
    post: {
      type: String
    }
  },
  { timestamps: true }
);

export default model('Draft', Draft);
