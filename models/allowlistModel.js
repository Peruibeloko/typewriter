import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const allowlistSchema = new Schema({
  _id: {
    type: String,
    required: 'User email'
  },
  isRegistered: {
    type: Boolean,
    default: false
  }
});

export default model('Allowlist', allowlistSchema);
