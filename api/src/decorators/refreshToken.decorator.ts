import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  COOKIES_REFRESH_TOKEN_KEY,
  HEADERS_REFRESH_TOKEN_KEY,
} from '../common/constants';

export const RefreshToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return (
      request.headers[HEADERS_REFRESH_TOKEN_KEY] ||
      request.cookies[COOKIES_REFRESH_TOKEN_KEY]
    );
  },
);
