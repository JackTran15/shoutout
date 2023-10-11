import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthLoginDTO, AuthRegisterDTO } from './auth.dto';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    renewTokens: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDTO: AuthRegisterDTO = {
        email: 'test@example.com',
        password: 'password123',
      };
      const registeredUser = {
        _id: 'user123',
        email: 'test@example.com',
      };

      mockAuthService.register.mockResolvedValue(registeredUser);

      const result = await authController.register(registerDTO);

      expect(result).toEqual(registeredUser);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDTO);
    });
  });

  describe('login', () => {
    it('should authenticate and log in a user', async () => {
      const loginDTO: AuthLoginDTO = {
        email: 'test@example.com',
        password: 'password123',
      };
      const accessToken = 'valid_access_token';
      const refreshToken = 'valid_refresh_token';
      const mockRes = {
        cookie: jest.fn(),
      };

      mockAuthService.login.mockResolvedValue({ accessToken, refreshToken });

      const result = await authController.login(loginDTO, undefined, mockRes);

      expect(result).toEqual({ accessToken, refreshToken });
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDTO);
    });
  });

  describe('renewTokens', () => {
    it('should renew access and refresh tokens', async () => {
      const tokenData = { token: 'valid_refresh_token' };
      const accessToken = 'new_access_token';
      const refreshToken = 'new_refresh_token';

      mockAuthService.renewTokens.mockResolvedValue({
        accessToken,
        refreshToken,
      });

      const mockRes = {
        cookie: jest.fn(),
      };
      const result = await authController.renewTokens(
        tokenData.token,
        undefined,
        mockRes,
      );

      expect(result).toEqual({ accessToken, refreshToken });
      expect(mockAuthService.renewTokens).toHaveBeenCalledWith(tokenData.token);
    });
  });
});
