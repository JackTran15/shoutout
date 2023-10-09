import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, ProjectionType, QueryOptions, SortOrder } from 'mongoose';
import { Model, Document } from 'mongoose';

@Injectable()
export class BaseCrudService<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const createdItem = new this.model(data);
    return await createdItem.save();
  }

  async findById(id: string): Promise<T> {
    const item = await this.model.findById(id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const item = await this.findById(id);
    Object.assign(item, data);
    return await item.save();
  }

  async delete(id: string): Promise<T> {
    const item = await this.findById(id);
    await item.deleteOne({ _id: id });
    return item;
  }

  async deleteMany(filter: FilterQuery<T>): Promise<any> {
    return this.model.deleteMany(filter);
  }

  async findOne(filter: FilterQuery<T>, select?: string): Promise<T | null> {
    return await this.model.findOne(filter).select(select).lean();
  }

  async find(
    filter: FilterQuery<T>,
    skip?: number,
    limit?: number,
  ): Promise<T[]> {
    const pipline = this.model.find(filter).sort({ _id: 1, createdAt: -1 });
    const _skip = skip || 0;
    const _limit = limit || 0;

    if (_skip) pipline.skip(_skip);
    if (_limit) pipline.skip(_limit);

    return pipline.exec();
  }
}
