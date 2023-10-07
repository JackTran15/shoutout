// generate nestjs controller

import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './message.service';
import { AuthGuard } from '../auth/auth.guard';
import { MessageDTO } from './message.dto';
import { GetAuth } from '../auth/auth.decorator';
import { Auth } from '../auth/auth.model';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  getAll(@GetAuth() auth: Auth) {
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
  async delete(@Body() id: string, @GetAuth() auth: Auth) {
    const exists = await this.messagesService.findById(id);
    if (!exists) throw new NotFoundException('Messages is not exists');

    if (exists.author !== auth._id)
      throw new ForbiddenException('You do not own this message');

    return this.messagesService.delete(id);
  }
}
