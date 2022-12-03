import { model, Schema } from 'mongoose';
import { IUser } from './userModel.js';

interface IPost {
  title: string;
  author: string | Partial<IUser>;
  post: string;
  createdAt: Date;
  updatedAt: Date;
}

const Post = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is missing']
    },
    author: {
      type: String,
      ref: 'User',
      required: [true, 'Author is missing'],
      immutable: true
    },
    post: {
      type: String,
      required: [true, 'Content is missing']
    }
  },
  { timestamps: true }
);

export default model<IPost>('Post', Post);
