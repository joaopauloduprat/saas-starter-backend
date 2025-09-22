import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserEntity } from '../user/entities/user.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authServiceMock: DeepMockProxy<AuthService>;

  const mockUser = {
    email: 'alice@test.com',
    password: 'password',
  };

  const mockResult = {
    user: new UserEntity(mockUser),
    access_token: 'fake-jwt-token',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockDeep<AuthService>() }],
    }).compile();

    authServiceMock = module.get(AuthService);
    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should call AuthService.signup and return a user', async () => {
    const user = { ...mockUser, name: 'Alice' };

    authServiceMock.signup.mockResolvedValue(mockResult);

    expect(await authController.signup(user)).toEqual(mockResult);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(authServiceMock.signup).toHaveBeenCalledWith(user);
  });

  it('should call AuthService.login and return a token', async () => {
    authServiceMock.login.mockResolvedValue(mockResult);

    expect(await authController.login(mockUser)).toEqual(mockResult);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(authServiceMock.login).toHaveBeenCalledWith(mockUser);
  });
});
