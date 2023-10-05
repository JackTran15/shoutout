import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Auth } from './auth.model';

export const GetAuth = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.auth as Auth;
  },
);
