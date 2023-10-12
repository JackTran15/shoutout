import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

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
  @ApiProperty()
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
  @ApiProperty()
  author: string;
}
