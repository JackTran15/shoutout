import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Auth } from '../auth/auth.model';
import * as bcrypt from 'bcrypt';
import {
  AccessTokenPayloadDTO,
  AuthLoginDTO,
  AuthRegisterDTO,
  RefreshTokenApiResponse,
} from './auth.dto';
import { BaseCrudService } from '../common/base';
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
    const payload = await this.jwtService
      .verifyAsync<AccessTokenPayloadDTO>(token)
      .catch((error) => {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
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

    const account = await this.findOne({ email });

    if (!account)
      throw new HttpException('Account not found', HttpStatus.UNAUTHORIZED);

    const { password: accountPassword, ...accountInfo } = account;
    const isValidPassword = await bcrypt.compareSync(password, accountPassword);

    if (!isValidPassword)
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.UNAUTHORIZED,
      );

    const accessToken = this.generateAccessToken({
      email: accountInfo.email,
      _id: accountInfo._id || '',
    });

    const refreshToken = this.generateRefreshToken({ _id: accountInfo._id });

    await this.update(accountInfo._id, { refreshToken });

    return {
      account: accountInfo,
      accessToken,
      refreshToken,
    };
  }

  async renewTokens(token: string): Promise<RefreshTokenApiResponse> {
    const payload = await this.jwtService.verifyAsync(token).catch(() => {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    });

    const account = await this.authModel.findOne({
      _id: payload._id,
    });

    if (account.refreshToken !== token)
      throw new HttpException('Session expired', HttpStatus.UNAUTHORIZED);

    if (!account)
      throw new HttpException(
        'Account not found or token',
        HttpStatus.UNAUTHORIZED,
      );

    const accessToken = this.generateAccessToken(account);
    const refreshToken = this.generateRefreshToken(account);

    await this.update(account._id, { refreshToken });

    return {
      accessToken,
      refreshToken,
    };
  }
}
