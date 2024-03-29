import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../auth/auth.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  const mockAuthService = {
    validateAccessToken: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  describe('canActivate', () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'valid_token',
          },
        }),
      }),
    } as ExecutionContext;

    it('should return true for a valid token', async () => {
      const tokenPayload = {
        email: 'test@example.com',
        _id: 'user123',
      };

      mockAuthService.validateAccessToken.mockResolvedValue(tokenPayload);
      mockAuthService.findOne.mockResolvedValue({
        _id: 'user123',
        email: 'test@example.com',
      });

      const result = await authGuard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException for missing token', async () => {
      const context = {
        ...mockContext,
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
        }),
      } as ExecutionContext;

      try {
        await authGuard.canActivate(context);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Unauthenticated');
      }
    });

    it('should return false for an invalid token', async () => {
      mockAuthService.validateAccessToken.mockResolvedValue(null);

      const result = await authGuard.canActivate(mockContext);

      expect(result).toBe(false);
    });
  });
});
