import { Body, Controller, Patch, Post, Put, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthLoginDTO,
  AuthRegisterDTO,
  LoginApiResponse,
  RefreshTokenApiResponse,
} from './auth.dto';
import { ParsedUserAgent, UserAgent } from '../decorators/userAgent.decorator';
import { RefreshToken } from '../decorators/refreshToken.decorator';
import { ApiOkResponse } from '@nestjs/swagger';
import { COOKIES_EXPIRE, COOKIES_KEY, isProduction } from '../common/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  @ApiOkResponse({
    description: 'ok',
    type: String,
  })
  async register(@Body() data: AuthRegisterDTO) {
    return this.service.register(data);
  }

  @Put('login')
  @ApiOkResponse({
    description: 'tokens and account info',
    type: LoginApiResponse,
  })
  async login(
    @Body() data: AuthLoginDTO,
    @UserAgent() userAgent: ParsedUserAgent,
    @Res({ passthrough: true }) res,
  ): Promise<LoginApiResponse> {
    const { refreshToken, accessToken, account } = await this.service.login(
      data,
    );

    res.cookie(COOKIES_KEY, refreshToken, {
      maxAge: COOKIES_EXPIRE, // 7 days
      httpOnly: true,
      secure: isProduction(),
      sameSite: 'lax',
    });

    const result: any = { accessToken, account };
    if (!userAgent?.browser?.name) result.refreshToken = refreshToken;
    return result;
  }

  @Patch('/refresh')
  async renewTokens(
    @RefreshToken() token: string,
    @UserAgent() userAgent: ParsedUserAgent,
    @Res({ passthrough: true }) res,
  ): Promise<RefreshTokenApiResponse> {
    const { refreshToken, accessToken } = await this.service.renewTokens(token);

    res.cookie(COOKIES_KEY, refreshToken, {
      maxAge: COOKIES_EXPIRE, // 7 days
      httpOnly: true,
      secure: isProduction(),
      sameSite: 'lax',
    });

    const result: any = { accessToken };
    if (!userAgent?.browser?.name) result.refreshToken = refreshToken;
    return result;
  }
}
