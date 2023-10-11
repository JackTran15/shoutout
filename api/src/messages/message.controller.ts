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
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './message.service';
import { AuthGuard } from '../auth/auth.guard';
import { MessageDTO } from './message.dto';
import { GetAuth } from '../decorators/auth.decorator';
import { Auth } from '../auth/auth.model';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('/personal')
  getPersonalMessages(
    @GetAuth() auth: Auth,
    @Query('cursor') endCursor: string,
    @Query('limit') limit: number,
  ) {
    return this.messagesService.findPersonalMessagesWithCursor({
      authorId: auth._id,
      endCursor,
      limit,
    });
  }

  @Post('/create')
  create(@Body() data: MessageDTO, @GetAuth() auth: Auth) {
    data.author = auth._id;
    return this.messagesService.create(data);
  }

  @Put(':id')
  udpate(@Body() data: MessageDTO, @Param('id') id: string, @GetAuth() auth) {
    data.updatedAt = new Date();
    data.author = auth.id;
    return this.messagesService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @GetAuth() auth: Auth) {
    const exists = await this.messagesService.findById(id);
    if (!exists) throw new NotFoundException('Messages is not exists');

    if (exists.author.toString() !== auth._id.toString())
      throw new ForbiddenException('You do not own this message');

    return this.messagesService.delete(id);
  }
}
