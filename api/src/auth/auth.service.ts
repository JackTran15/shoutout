import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Auth } from '../auth/auth.model';
import * as bcrypt from 'bcrypt';
import { AuthDto, AuthLoginDTO, AuthRegisterDTO } from './auth.dto';
import { BaseCrudService } from 'src/common/base';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService extends BaseCrudService<Auth> {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('auth') private readonly authModel: Model<Auth>,
  ) {
    super(authModel);
  }

  async validateAccessToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token).catch((err) => {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    });

    return payload;
  }

  async register(registerData: AuthRegisterDTO) {
    const { email, password } = registerData;
    const exist = await this.findOne({ email });

    if (exist) throw new HttpException('Duplicated email', HttpStatus.CONFLICT);

    const salt = bcrypt.genSaltSync(5);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const account = new this.authModel({
      email,
      password: hashedPassword,
      salt,
    });

    await account.save();

    return 'ok';
  }

  generateAccessToken(payload: { email: string; _id: string }) {
    const { email, _id } = payload;
    return this.jwtService.sign({ email, _id }, { expiresIn: '1h' });
  }

  generateRefreshToken(payload: { _id: string }) {
    const { _id } = payload;
    return this.jwtService.sign({ _id }, { expiresIn: '7d' });
  }

  async login(data: AuthLoginDTO) {
    const { email, password } = data;

    const account = await this.authModel.findOne({
      email,
    });

    if (!account)
      throw new HttpException('Account not found', HttpStatus.UNAUTHORIZED);

    const isValidPassword = await bcrypt.compareSync(
      password,
      account.password,
    );

    if (!isValidPassword)
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.UNAUTHORIZED,
      );

    const accessToken = this.generateAccessToken(account);
    const refreshToken = this.generateRefreshToken(account);

    return {
      account,
      accessToken,
      refreshToken,
    };
  }

  async renewTokens(token: string) {
    const payload = await this.jwtService.verifyAsync(token).catch(() => {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    });

    const account = await this.authModel.findOne({ _id: payload._id });
    if (!account)
      throw new HttpException('Account not found', HttpStatus.UNAUTHORIZED);

    const accessToken = this.generateAccessToken(account);
    const refreshToken = this.generateRefreshToken(account);

    return {
      accessToken,
      refreshToken,
    };
  }
}
