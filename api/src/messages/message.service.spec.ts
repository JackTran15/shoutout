// messages.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MessageSchema } from './message.model';
import mongoose from 'mongoose';

describe('MessagesService', () => {
  let messagesService: MessagesService;
  let mongod: MongoMemoryServer;
  let uri: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: 'message', schema: MessageSchema }]),
      ],
      providers: [MessagesService],
    }).compile();

    messagesService = module.get<MessagesService>(MessagesService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  it('Should be defined', () => {
    expect(messagesService).toBeDefined();
  });

  it('Should create a message with right format and delete it', async () => {
    const data = {
      content: 'shoutout',
      author: '1',
    };

    const result = await messagesService.create(data);
    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('author');

    expect(result.content).toEqual(data.content);
    expect(result.author).toEqual(data.author);
  });

  it('Should create a message with right format', async () => {
    const data = {
      content: 'shoutout',
      author: '1',
    };

    const result = await messagesService.create(data);
    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('author');

    expect(result.content).toEqual(data.content);
    expect(result.author).toEqual(data.author);
  });

  it('Should found the result that have already created', async () => {
    const data = {
      content: 'shoutout',
      author: '2',
    };

    const result = await messagesService.create(data);
    const id = result._id;

    const found = await messagesService.findOne({ _id: id });

    expect(found.content).toEqual(data.content);
    expect(found.author).toEqual(data.author);
  });

  it('Should delete all the records', async () => {
    await messagesService.deleteMany({});
    const records = await messagesService.find({});
    expect(records.length).toEqual(0);
  });

  it('Should delete right the record by ID', async () => {
    const data = [
      {
        content: 'shoutout 1',
        author: '1',
      },
      {
        content: 'shoutout 2',
        author: '2',
      },
    ];

    await Promise.all([
      messagesService.create(data[0]),
      messagesService.create(data[1]),
    ]);

    const records = await messagesService.find({});
    expect(records.length).toEqual(2);

    await messagesService.delete(records[0]._id);

    const afterDeleteRecords = await messagesService.find({});

    // should have 1 record left and is the data[1]
    expect(afterDeleteRecords.length).toEqual(1);
    expect(afterDeleteRecords[0]._id).toEqual(records[1]._id);
    expect(afterDeleteRecords[0].content).toEqual(data[1].content);
    expect(afterDeleteRecords[0].author).toEqual(data[1].author);
  });

  it('Should update record successfully', async () => {
    const data = {
      content: 'shoutout',
      author: '2',
    };

    const changedContent = 'changed';

    const record = await messagesService.create(data);
    const id = record._id;

    await messagesService.update(id, {
      content: changedContent,
    });

    const updateRecord = await messagesService.findById(id);

    expect(updateRecord.content).toEqual(changedContent);
    expect(updateRecord.author).toEqual(data.author);
  });
});
