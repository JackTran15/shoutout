import * as mongoose from 'mongoose';
import { Auth } from 'nats';

export const MessageSchema = new mongoose.Schema({
  content: { type: String, required: true, maxLength: 280 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'auth', required: true },
  updatedAt: { type: Date, default: new Date() },
  createdAt: { type: Date, default: new Date() },
});

export interface Message extends mongoose.Document {
  content: string;
  author: mongoose.Types.ObjectId | string | Auth;
  updatedAt: Date;
  createdAt: Date;
}
