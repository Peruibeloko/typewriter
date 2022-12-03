import { model, Schema } from 'mongoose';

export interface IUser {
  _id: string;
  displayName: string;
  secret: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    _id: {
      type: String,
      required: [true, 'User email is missing'],
      match: /^\s+@\s+\.\s+$/
    },
    displayName: {
      type: String,
      required: [true, 'Display name is missing']
    },
    secret: {
      type: String,
      required: [true, '2FA generation secret token is missing'],
      immutable: true
    }
  },
  { timestamps: true }
);

export default model<IUser>('User', userSchema);
