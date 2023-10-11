import { BaseCrudService } from '../common/base';
import { Message } from './message.model';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';

Injectable();
export class MessagesService extends BaseCrudService<Message> {
  constructor(
    @InjectModel('message') protected readonly messageModel: Model<Message>,
  ) {
    super(messageModel);
  }

  async findPersonalMessages(
    query: FilterQuery<Message>,
    option: QueryOptions<Message>,
  ): Promise<{ data: Message[]; total: number; skip: number; limit: number }> {
    option.sort = { createdAt: -1, _id: -1 };
    const [data, total] = await Promise.all([
      this.messageModel
        .find(query)
        .sort(option.sort)
        .skip(option.skip)
        .limit(option.limit),
      this.messageModel.countDocuments(query),
    ]);

    return { data, total, skip: option.skip || 0, limit: option.limit || 0 };
  }
}
