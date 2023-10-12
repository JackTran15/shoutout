import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  @ApiProperty({
    example: 'password123',
    description: 'The user password (6 to 50 characters)',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'refreshToken123',
    description: 'The user refresh token',
  })
  refreshToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'salt123', description: 'The user salt' })
  salt: string;

  createdAt: Date;
  updatedAt: Date;
}

export class AuthLoginDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  @ApiProperty({
    example: 'password123',
    description: 'The user password (6 to 50 characters)',
  })
  password: string;
}

export class AccessTokenPayloadDTO {
  @IsString()
  @ApiProperty({ example: '12345', description: 'The user ID' })
  _id: string;

  @IsEmail()
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  email: string;
}

export class AuthRegisterDTO extends AuthLoginDTO {}

export class AccountInfo {
  @ApiProperty({ example: 'abc@email.com' })
  email: string;

  @IsDate()
  @ApiProperty()
  createdAt: Date;

  @IsDate()
  @ApiProperty()
  updatedAt: Date;

  @IsString()
  @ApiProperty({
    example: 'mongoDB objectID',
    description: "user's id",
  })
  _id?: string;
}

export class RefreshTokenApiResponse {
  @IsString()
  @ApiProperty({
    example: 'access token',
    description: 'Authorization header token required',
  })
  accessToken: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'refresh token to renew access token and it self',
    description: 'HTTP only cookie or header["a_rt"]',
  })
  refreshToken?: string;
}

export class LoginApiResponse extends RefreshTokenApiResponse {
  @ApiProperty()
  account: AccountInfo;
}
