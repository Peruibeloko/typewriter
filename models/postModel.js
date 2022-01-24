import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const Post = new Schema({
  datetime: {
    type: Number,
    default: Date.now,
    immutable: true
  },
  title: {
    type: String,
    required: 'Post title'
  },
  author: {
    type: String,
    required: 'Author'
  },
  post: {
    type: String,
    required: 'Post content in Commonmark format'
  }
});

export default model('Post', Post);
