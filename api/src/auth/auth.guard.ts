import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.token;
    if (!token) throw new UnauthorizedException('Missing token in header');

    const tokenPayload = await this.authService.validateAccessToken(token);

    if (!tokenPayload) return false;

    const auth = await this.authService.findOne({
      email: tokenPayload.email,
      _id: tokenPayload._id,
    });

    if (!auth) return false;
    request.auth = auth;
    return true;
  }
}
