import { IsOptional, IsString, MaxLength } from 'class-validator';

export class MessageDTO {
  @IsString()
  @MaxLength(280)
  content: string;

  @IsOptional()
  updatedAt: Date;

  @IsOptional()
  author: string;
}
