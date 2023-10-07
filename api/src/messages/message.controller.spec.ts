import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './message.controller';
import { MessagesService } from './message.service';
import { MessageDTO } from './message.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Auth } from '../auth/auth.model';

describe('MessagesController', () => {
  let messagesController: MessagesController;

  const mockMessagesService = {
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    udpateOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        {
          provide: MessagesService,
          useValue: mockMessagesService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true }) // Mock the AuthGuard for simplicity
      .compile();

    messagesController = module.get<MessagesController>(MessagesController);
  });

  it('should be defined', () => {
    expect(messagesController).toBeDefined();
  });

  describe('getAll', () => {
    it('should return messages for authenticated user', async () => {
      const auth = { _id: 'user123' };
      const mockMessages = [{ content: 'Hello', author: 'user123' }];
      mockMessagesService.find.mockResolvedValue(mockMessages);

      const result = await messagesController.getAll(auth as Auth);

      expect(result).toEqual(mockMessages);
      expect(mockMessagesService.find).toHaveBeenCalledWith({
        author: auth._id,
      });
    });
  });

  describe('create', () => {
    it('should create a new message', async () => {
      const messageDTO: MessageDTO = {
        content: 'Hello',
        author: 'user123',
        updatedAt: new Date(),
      };
      const createdMessage = { ...messageDTO, _id: 'message123' };
      mockMessagesService.create.mockResolvedValue(createdMessage);

      const result = await messagesController.create(messageDTO);

      expect(result).toEqual(createdMessage);
      expect(mockMessagesService.create).toHaveBeenCalledWith(messageDTO);
    });
  });

  describe('update', () => {
    it('should update a message', async () => {
      const messageDTO: MessageDTO = {
        content: 'Updated',
        author: 'user123',
        updatedAt: new Date(),
      };
      const messageId = 'message123';
      const auth = { id: 'user123' };

      mockMessagesService.update.mockResolvedValue({
        message: 'Message updated successfully',
      });

      const result = await messagesController.udpate(
        messageDTO,
        messageId,
        auth,
      );

      expect(result).toEqual({ message: 'Message updated successfully' });
      expect(mockMessagesService.update).toHaveBeenCalledWith(
        messageId,
        messageDTO,
      );
    });
  });

  describe('delete', () => {
    it('should delete a message', async () => {
      const messageId = 'message123';
      const auth: Partial<Auth> = { _id: 'user123' }; // Provide the _id property

      // Mock the findById function to return an existing message
      mockMessagesService.findById.mockResolvedValue({
        _id: messageId,
        author: 'user123', // Assuming it matches the auth user's _id
      });

      mockMessagesService.delete.mockResolvedValue({
        message: 'Message deleted successfully',
      });

      const result = await messagesController.delete(messageId, auth as Auth);

      expect(result).toEqual({ message: 'Message deleted successfully' });
      expect(mockMessagesService.delete).toHaveBeenCalledWith(messageId);
    });
  });
});
