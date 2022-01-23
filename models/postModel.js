import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const Post = new Schema({
  id: {
    type: Number,
    required: 'Post number'
  },
  title: {
    type: String,
    required: 'Post title'
  },
  datetime: {
    type: Date,
    required: 'Publication date and time'
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
