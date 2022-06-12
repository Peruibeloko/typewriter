import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const userSchema = new Schema({
  _id: {
    type: String,
    required: 'User email',
    match: /^\s+@\s+\.\s+$/
  },
  displayName: {
    type: String,
    required: 'Display name is missing'
  },
  secret: {
    type: String,
    required: '2FA generation secret token is missing',
    immutable: true
  },
  creationDate: {
    type: Number,
    default: Date.now,
    immutable: true
  }
});

export default model('User', userSchema);
