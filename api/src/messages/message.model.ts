import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'messages' })
export class Message extends Document {
  @Prop({ required: true, maxlength: 280 })
  content: string;

  @Prop({ type: String, ref: 'auth', required: true })
  author: string;

  @Prop({ default: new Date() })
  updatedAt: Date;

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
