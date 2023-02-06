import { Schema, Document } from 'mongoose';

export const User = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export interface IUser extends Document {
  readonly _id: Schema.Types.ObjectId;

  readonly username: string;

  password: string;

  readonly date: Date;
}
