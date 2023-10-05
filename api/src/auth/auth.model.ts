import * as mongoose from 'mongoose';

export const AuthSchema = new mongoose.Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  refreshToken: { type: String, require: true },
  salt: { type: String, require: true },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

export interface Auth extends mongoose.Document {
  email: string;
  password: string;
  refreshToken: string;
  salt: string;
  createdAt: Date;
  author: mongoose.Types.ObjectId;
  updatedAt: Date;
}
