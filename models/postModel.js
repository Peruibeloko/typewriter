const mongoose = require('mongoose');

const { Schema } = mongoose;

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

module.exports = mongoose.model('Post', Post);
