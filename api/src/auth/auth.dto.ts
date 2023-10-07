import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 50) // Minimum length: 6, Maximum length: 50
  password: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsString()
  @IsNotEmpty()
  salt: string;

  createdAt: Date;
  updatedAt: Date;
}

export class AuthLoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 50) // Minimum length: 6, Maximum length: 50
  password: string;
}

export class AccessTokenPayloadDTO {
  @IsString()
  _id: string;

  @IsEmail()
  email: string;
}

export class AuthRegisterDTO extends AuthLoginDTO {}
