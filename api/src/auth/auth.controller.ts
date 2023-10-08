import { Body, Controller, Patch, Post, Put, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDTO, AuthRegisterDTO } from './auth.dto';
import { ParsedUserAgent, UserAgent } from 'src/decorators/userAgent.decorator';
import { RefreshToken } from 'src/decorators/refreshToken.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  async register(@Body() data: AuthRegisterDTO) {
    return this.service.register(data);
  }

  @Put('login')
  async login(
    @Body() data: AuthLoginDTO,
    @UserAgent() userAgent,
    @Res({ passthrough: true }) res,
  ) {
    const { refreshToken, accessToken, account } = await this.service.login(
      data,
    );

    res.cookie('a_rt', refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const result: any = { accessToken, account };
    if (!userAgent.browser?.name) result.refreshToken = refreshToken;
    return result;
  }

  @Patch('/refresh')
  async renewTokens(
    @RefreshToken() token: string,
    @UserAgent() userAgent: ParsedUserAgent,
    @Res({ passthrough: true }) res,
  ) {
    const { refreshToken, accessToken } = await this.service.renewTokens(token);

    res.cookie('a_rt', refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const result: any = { accessToken };
    if (!userAgent.browser?.name) result.refreshToken = refreshToken;
    return result;
  }
}
