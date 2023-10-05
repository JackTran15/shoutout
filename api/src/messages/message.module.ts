import { Module } from '@nestjs/common';
import { MessagesController } from './message.controller';
import { MessagesService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './message.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'message', schema: MessageSchema }]),
    AuthModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessageModule {}
