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
import {
  CreateMessageApiResponse,
  GetPersonalMessagesApiResponse,
  MessageDTO,
} from './message.dto';
import { GetAuth } from '../decorators/auth.decorator';
import { Auth } from '../auth/auth.model';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('/personal')
  @ApiOkResponse({
    status: 200,
    type: GetPersonalMessagesApiResponse,
    description: 'get messages of current user',
  })
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
  @ApiOkResponse({
    status: 201,
    type: CreateMessageApiResponse,
  })
  create(@Body() data: MessageDTO, @GetAuth() auth: Auth) {
    data.author = auth._id;
    return this.messagesService.create(data);
  }

  @Put(':id')
  @ApiOkResponse({
    status: 200,
    type: CreateMessageApiResponse,
  })
  udpate(@Body() data: MessageDTO, @Param('id') id: string, @GetAuth() auth) {
    data.updatedAt = new Date();
    data.author = auth.id;
    return this.messagesService.update(id, data);
  }

  @Delete(':id')
  @ApiOkResponse({
    status: 200,
    type: String,
    description: 'ok',
  })
  async delete(@Param('id') id: string, @GetAuth() auth: Auth) {
    const exists = await this.messagesService.findById(id);
    if (!exists) throw new NotFoundException('Messages is not exists');

    if (exists.author.toString() !== auth._id.toString())
      throw new ForbiddenException('You do not own this message');

    await this.messagesService.delete(id);
    return 'ok';
  }
}
