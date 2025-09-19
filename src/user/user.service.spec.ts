import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let userService: UserService;
  let prismaMock: DeepMockProxy<PrismaClient>;

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
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should return all users', async () => {
    prismaMock.user.findMany.mockResolvedValue(mockUsers);

    const users = await userService.findAll();

    expect(users).toEqual(mockUsers);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaMock.user.findMany).toHaveBeenCalled();
  });

  it('should return one user by id', async () => {
    prismaMock.user.findUnique.mockImplementation(
      ({ where }) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        Promise.resolve(mockUsers.find((user) => user.id === where.id)) as any,
    );

    const user = await userService.findOne('1');

    expect(user).toEqual(mockUsers[0]);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('should create a new user', async () => {
    prismaMock.user.create.mockImplementation(
      ({ data }) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        Promise.resolve({ id: mockUsers.length + 1, ...data }) as any,
    );

    const newUser = {
      name: 'Charlie',
      email: 'charlie@test.com',
      password: '1a2b3c4a',
    };
    const createdUser = await userService.create(newUser);

    expect(createdUser).toMatchObject(newUser);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaMock.user.create).toHaveBeenCalledWith({ data: newUser });
  });

  it('should update an user', async () => {
    prismaMock.user.update.mockImplementation(
      ({ where, data }) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        Promise.resolve({
          ...mockUsers.find((user) => user.id === where.id),
          ...data,
        }) as any,
    );

    const user = { name: 'Ítalo' };
    const updatedUser = await userService.update('1', user);

    expect(updatedUser.name).toBe('Ítalo');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: user,
    });
  });

  it('should delete an user', async () => {
    prismaMock.user.delete.mockImplementation(
      ({ where }) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        Promise.resolve(mockUsers.find((user) => user.id === where.id)) as any,
    );

    const deleteUser = await userService.delete('2');

    expect(deleteUser).toEqual(mockUsers[1]);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { id: '2' } });
  });
});
