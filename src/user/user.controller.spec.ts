import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from "jest-mock-extended";

import { UserService } from "./user.service";
import { UserController } from './user.controller';

describe('UserController', () => {
  let userController: UserController;
  let userServiceMock: DeepMockProxy<UserService>;

  const mockUsers = [
    { id: '1', name: 'Alice', email: 'alice@test.com', password: '123456' },
    { id: '2', name: 'Bob', email: 'bob@test.com', password: '654321' },
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
    expect(userServiceMock.findAll).toHaveBeenCalled();
  });

  it('should return one user by id', async () => {
    userServiceMock.findOne.mockImplementation((id) =>
      Promise.resolve(mockUsers.find(user => user.id === id))
    );

    const user = await userController.findOne('1');

    expect(user).toEqual(mockUsers[0]);
    expect(userServiceMock.findOne).toHaveBeenCalledWith('1');
  });

  it('should create a new user', async () => {
    userServiceMock.create.mockImplementation((data) =>
      Promise.resolve({ id: mockUsers.length + 1, ...data })
    );

    const newUser = { name: 'Charlie', email: 'charlie@test.com', password: '1a2b3c4a' };
    const createdUser = await userController.create(newUser);

    expect(createdUser).toMatchObject(newUser);
    expect(userServiceMock.create).toHaveBeenCalledWith(newUser);
  })

  it('should update an user', async () => {
    userServiceMock.update.mockImplementation((id, data) =>
      Promise.resolve({ ...mockUsers.find(user => user.id === id), ...data })
    );

    const user = { name: 'Ítalo' };
    const updatedUser = await userController.update('1', user);

    expect(updatedUser.name).toBe('Ítalo');
    expect(userServiceMock.update).toHaveBeenCalledWith('1', user);
  })

  it('should delete an user', async () => {
    userServiceMock.delete.mockImplementation((id) =>
      Promise.resolve(mockUsers.find(user => user.id === id))
    )

    const deleteUser = await userController.delete('2')

    expect(deleteUser).toEqual(mockUsers[1]);
    expect(userServiceMock.delete).toHaveBeenCalledWith('2');
  })
});
