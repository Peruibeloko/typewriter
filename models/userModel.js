import mongoose, { model } from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  _id: {
    type: String,
    required: 'User email'
  },
  secret: {
    type: String,
    required: '2FA generation secret token'
  },
  timestamp: {
    type: Number,
    required: 'Time of creation'
  }
});

export default model('User', userSchema);
