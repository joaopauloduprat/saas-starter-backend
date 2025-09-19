import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashedpassword')),
  compare: jest.fn(() => Promise.resolve(true)),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: DeepMockProxy<JwtService>;
  let userService: DeepMockProxy<UserService>;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedpassword',
    name: 'João',
    role: 'ADMIN',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    userService = mockDeep<UserService>();
    jwtService = mockDeep<JwtService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    jwtService.sign.mockReturnValue('fake-jwt-token');
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should signup a new user', async () => {
    userService.findByEmail.mockResolvedValue(null);
    userService.create.mockResolvedValue(mockUser);

    const result = await authService.signup({
      email: 'test@example.com',
      password: 'dwsdsa123',
      name: 'João',
    });

    const plainUser = instanceToPlain(result.user);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(userService.create).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'hashedpassword',
      name: 'João',
    });
    expect(result.access_token).toBe('fake-jwt-token');
    expect(plainUser).not.toHaveProperty('password');
  });
});
