import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { UserService } from './user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let userController: UserController;
  let userServiceMock: DeepMockProxy<UserService>;

  const mockUsers = [
    {
      id: '1',
      name: 'Alice',
      email: 'alice@test.com',
      password: '123456',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Bob',
      email: 'bob@test.com',
      password: '654321',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    userServiceMock = mockDeep<UserService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should return all users', async () => {
    userServiceMock.findAll.mockResolvedValue(mockUsers);

    const users = await userController.findAll();

    expect(users).toEqual(mockUsers);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(userServiceMock.findAll).toHaveBeenCalled();
  });

  it('should return one user by id', async () => {
    userServiceMock.findOne.mockImplementation(
      (id) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        Promise.resolve(mockUsers.find((user) => user.id === id)) as any,
    );

    const user = await userController.findOne('1');

    expect(user).toEqual(mockUsers[0]);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(userServiceMock.findOne).toHaveBeenCalledWith('1');
  });

  it('should create a new user', async () => {
    userServiceMock.create.mockImplementation(
      (data) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        Promise.resolve({ id: mockUsers.length + 1, ...data }) as any,
    );

    const newUser = {
      name: 'Charlie',
      email: 'charlie@test.com',
      password: '1a2b3c4a',
    };
    const createdUser = await userController.create(newUser);

    expect(createdUser).toMatchObject(newUser);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(userServiceMock.create).toHaveBeenCalledWith(newUser);
  });

  it('should update an user', async () => {
    userServiceMock.update.mockImplementation(
      (id, data) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        Promise.resolve({
          ...mockUsers.find((user) => user.id === id),
          ...data,
        }) as any,
    );

    const user = { name: 'Ítalo' };
    const updatedUser = await userController.update('1', user);

    expect(updatedUser.name).toBe('Ítalo');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(userServiceMock.update).toHaveBeenCalledWith('1', user);
  });

  it('should delete an user', async () => {
    userServiceMock.delete.mockImplementation(
      (id) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        Promise.resolve(mockUsers.find((user) => user.id === id)) as any,
    );

    const deleteUser = await userController.delete('2');

    expect(deleteUser).toEqual(mockUsers[1]);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(userServiceMock.delete).toHaveBeenCalledWith('2');
  });
});
