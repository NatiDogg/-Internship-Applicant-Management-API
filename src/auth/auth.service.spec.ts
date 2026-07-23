import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtTokenService } from 'src/utils/jwt';
import { UnauthorizedException } from '@nestjs/common';

// Mocking the bcrypt password comparison helper
jest.mock('src/utils/bcryptJs', () => ({
  matchPassword: jest.fn(),
}));

import { matchPassword } from 'src/utils/bcryptJs';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    admin: {
      findUnique: jest.fn(),
    },
  };

  const mockJwtTokenService = {
    createAccessToken: jest.fn().mockReturnValue('mocked_jwt_access_token'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtTokenService, useValue: mockJwtTokenService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const loginDto = { email: 'Admin@Example.com', password: 'plainpassword' };
    const mockAdmin = {
      id: 'admin-123',
      name: 'John Admin',
      email: 'admin@example.com',
      password: 'hashedpassword',
    };

    it('should successfully log in and return admin data with access token', async () => {
      // 1. mocking DB returning the admin
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      // 2. Mocking password match passing
      (matchPassword as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      // Verifying email was normalized to lowercase
      expect(mockPrismaService.admin.findUnique).toHaveBeenCalledWith({
        where: { email: 'admin@example.com' },
      });

      // Verifying token generation was called with safe admin payload (no password)
      expect(mockJwtTokenService.createAccessToken).toHaveBeenCalledWith({
        id: 'admin-123',
        name: 'John Admin',
        email: 'admin@example.com',
      });

      // Verifying shape of response
      expect(result).toEqual({
        success: true,
        message: 'Admin loggedin Successfully',
        admin: {
          id: 'admin-123',
          name: 'John Admin',
          email: 'admin@example.com',
        },
        accessToken: 'mocked_jwt_access_token',
      });
    });

    it('should throw UnauthorizedException if admin is not found', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid Credentials!'),
      );
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      (matchPassword as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid Credentials!'),
      );
    });
  });
});