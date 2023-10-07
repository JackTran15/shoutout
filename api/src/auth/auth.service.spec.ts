import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Auth, AuthSchema } from './auth.model';
import { AuthRegisterDTO, AuthLoginDTO } from './auth.dto';
import { HttpStatus } from '@nestjs/common';
import mongoose from 'mongoose';

describe('AuthService', () => {
  let authService: AuthService;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: 'auth', schema: AuthSchema }]),
        JwtModule.register({
          secret: 'mySuperSecrect',
        }),
      ],
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  it('Should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    afterEach(() => authService.deleteMany({}));

    it('Should register a new user with hashed password', async () => {
      const registerData: AuthRegisterDTO = {
        email: 'jack@gmail.com',
        password: 'jackpass',
      };

      const result = await authService.register(registerData);

      const account = await authService.findOne({ email: registerData.email });

      expect(result).toBe('ok');
      expect(account.password === registerData.password).toBeFalsy();
    });

    it('Should throw HttpException for duplicated email', async () => {
      const registerData1: AuthRegisterDTO = {
        email: 'jack1@gmail.com',
        password: 'jackpass',
      };

      const registerData2: AuthRegisterDTO = {
        email: 'jack1@gmail.com',
        password: 'jackpass',
      };
      await authService.register(registerData1);
      await authService.register(registerData2).catch((err) => {
        expect(err.status).toBe(HttpStatus.CONFLICT);
      });
    });
  });

  describe('login', () => {
    afterEach(() => authService.deleteMany({}));

    it('Should authenticate and log in a user', async () => {
      const registerData: AuthRegisterDTO = {
        email: 'jack@gmail.com',
        password: 'jackpass',
      };

      const register = await authService.register(registerData);
      expect(register).toBe('ok');

      const login = await authService.login(registerData);
      expect(login).toBeTruthy();
      expect(login.account.email).toEqual(registerData.email);
      expect(login.accessToken.length).toBeGreaterThan(0);
      expect(login.refreshToken.length).toBeGreaterThan(0);
    });

    it('Should throw HttpException for non-existing user', async () => {
      const registerData: AuthRegisterDTO = {
        email: 'jack@gmail.com',
        password: 'jackpass',
      };

      const register = await authService.register(registerData);
      expect(register).toBe('ok');

      await authService
        .login({
          email: 'random_string',
          password: registerData.password,
        })
        .catch((error) => {
          expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
        });
    });

    it('Should throw HttpException for invalid password', async () => {
      const registerData: AuthRegisterDTO = {
        email: 'jack@gmail.com',
        password: 'jackpass',
      };

      const register = await authService.register(registerData);
      expect(register).toBe('ok');

      await authService
        .login({
          email: registerData.email,
          password: 'random_string',
        })
        .catch((error) => {
          expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
        });
    });
  });

  describe('renewTokens', () => {
    afterEach(() => authService.deleteMany({}));

    it('Should renew access and refresh tokens', async () => {
      const registerData: AuthRegisterDTO = {
        email: 'jack@gmail.com',
        password: 'jackpass',
      };

      const register = await authService.register(registerData);
      expect(register).toBe('ok');

      const login = await authService.login(registerData);
      expect(login).toBeTruthy();

      const result = await authService.renewTokens(login.refreshToken);
      expect(result.accessToken.length).toBeGreaterThan(0);
      expect(result.refreshToken.length).toBeGreaterThan(0);
    });

    it('Should throw HttpException for invalid token', async () => {
      await authService.renewTokens('invalid_token').catch((error) => {
        expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('validateAccessToken', () => {
    afterEach(() => authService.deleteMany({}));

    it('Should validate a valid access token', async () => {
      const registerData: AuthRegisterDTO = {
        email: 'jack@gmail.com',
        password: 'jackpass',
      };

      const register = await authService.register(registerData);
      expect(register).toBe('ok');

      const login = await authService.login(registerData);
      expect(login).toBeTruthy();

      const result = await authService.validateAccessToken(login.refreshToken);
      expect(result._id.toString()).toEqual(login.account._id.toString());
    });

    it('Should throw HttpException for invalid access token', async () => {
      await authService.validateAccessToken('invalid_token').catch((error) => {
        expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });
});
