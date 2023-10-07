import { BaseCrudService } from '../common/base';
import { Message } from './message.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

Injectable();
export class MessagesService extends BaseCrudService<Message> {
  constructor(
    @InjectModel('message') protected readonly messageModel: Model<Message>,
  ) {
    super(messageModel);
  }
}
