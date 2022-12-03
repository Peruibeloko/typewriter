import { model, Schema } from 'mongoose';

interface IAllowlist {
  _id: string;
  isRegistered: boolean;
}

const allowlistSchema = new Schema<IAllowlist>({
  _id: {
    type: String,
    required: [true, 'User email is required']
  },
  isRegistered: {
    type: Boolean,
    default: false,
    required: true
  }
});

export default model<IAllowlist>('Allowlist', allowlistSchema);
