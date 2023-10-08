import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UAParser } from 'ua-parser-js';

export type ParsedUserAgent = {
  ua: string; // 'PostmanRuntime/7.33.0';
  browser: { name?: string; version?: string; major?: string };
  engine: { name?: string; version?: string };
  os: { name?: string; version?: string };
  device: { vendor?: string; model?: string; type?: string };
  cpu: { architecture?: string };
};

export const UserAgent = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ParsedUserAgent => {
    const request = ctx.switchToHttp().getRequest();
    const parser = new UAParser(request.headers['user-agent']);
    const userAgent = parser.getResult();
    return userAgent as ParsedUserAgent;
  },
);
