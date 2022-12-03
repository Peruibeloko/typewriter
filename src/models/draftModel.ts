import { model, Schema } from 'mongoose';
import { IUser } from './userModel.js';

interface IDraft {
  lastUpdated: number;
  title: string;
  author: string | Partial<IUser>;
  post: string;
  createdAt: Date;
  updatedAt: Date;
}

const Draft = new Schema<IDraft>(
  {
    title: {
      type: String
    },
    author: {
      type: String,
      ref: 'User',
      required: [true, 'Author is missing'],
      immutable: true
    },
    post: {
      type: String
    }
  },
  { timestamps: true }
);

export default model<IDraft>('Draft', Draft);
