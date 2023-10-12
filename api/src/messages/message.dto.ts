import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class MessageDTO {
  @IsString()
  @MaxLength(280)
  @ApiProperty({ example: 'Hello World', description: 'The message content' })
  content: string;

  @IsOptional()
  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  author: string;
}

export class CreateMessageApiResponse extends MessageDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'mongoDB objectID' })
  _id: string;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  createdAt: Date;

  @IsOptional()
  @ApiProperty({ example: 'user_id' })
  author: string;
}

export class GetPersonalMessagesApiResponse {
  @ApiProperty({
    isArray: true,
    example: [
      {
        _id: 'mongoDB_ObjectId',
        content: 'message_content',
        author: 'user_id',
        updatedAt: '2023-10-12T10:41:50.452Z',
        createdAt: '2023-10-12T10:41:50.452Z',
        __v: 0,
      },
    ],
  })
  data: CreateMessageApiResponse[];

  @ApiProperty()
  @IsNumber()
  limit: number;

  @ApiProperty({ example: 'last_message_id' })
  @IsNumber()
  endCursor: string;

  @ApiProperty()
  @IsNumber()
  total: number;
}
