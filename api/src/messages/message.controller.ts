// generate nestjs controller

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './message.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { MessageDTO } from './message.dto';
import { GetAuth } from 'src/auth/auth.decorator';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  getAll(@GetAuth() auth) {
    return this.messagesService.find({ author: auth._id });
  }

  @Post('/create')
  create(@Body() data: MessageDTO) {
    return this.messagesService.create(data);
  }

  @Put(':id')
  udpate(@Body() data: MessageDTO, @Param('id') id: string, @GetAuth() auth) {
    data.updatedAt = new Date();
    data.author = auth.id;
    return this.messagesService.update(id, data);
  }

  @Delete()
  delete(@Body() data: string) {
    return this.messagesService.delete(data);
  }
}
