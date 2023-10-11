import { BaseCrudService } from '../common/base';
import { Message } from './message.model';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, QueryOptions } from 'mongoose';
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
    option.sort = { _id: -1 };
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

  async findPersonalMessagesWithCursor(params: {
    endCursor: string;
    authorId: string;
    limit: number;
  }) {
    const { endCursor, authorId, limit } = params;

    const conditions = endCursor ? { _id: { $lt: endCursor } } : {};

    const [data, total] = await Promise.all([
      this.messageModel
        .find({ author: authorId, ...conditions })
        .sort({ _id: -1 })
        .limit(limit)
        .lean(),
      this.messageModel.countDocuments({
        author: authorId,
      }),
    ]);

    return { data, total, endCursor: data[data.length - 1]?._id, limit };
  }
}
