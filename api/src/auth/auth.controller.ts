import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDTO, AuthRegisterDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  async register(@Body() data: AuthRegisterDTO) {
    return this.service.register(data);
  }

  @Put('login')
  async login(@Body() data: AuthLoginDTO) {
    return this.service.login(data);
  }

  @Put('/refresh')
  async renewTokens(@Body() data) {
    return this.service.renewTokens(data.token);
  }
}
