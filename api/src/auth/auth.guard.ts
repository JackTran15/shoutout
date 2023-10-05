// auth/auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.token;
    if (!token) throw new UnauthorizedException('Missing token in header');

    const tokenPayload = await this.authService.validateAccessToken(token);

    const auth = await this.authService.findOne({
      email: tokenPayload.email,
      _id: tokenPayload._id,
    });

    if (!auth) return false;
    request.auth = auth;
    return true;
  }
}
