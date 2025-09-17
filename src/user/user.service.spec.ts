import { PrismaClient } from "@prisma/client";
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from "jest-mock-extended";

import { UserService } from './user.service';
import { PrismaService } from "../prisma/prisma.service";

describe('UserService', () => {
  let userService: UserService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  const mockUsers = [
    { id: '1', name: 'Alice', email: 'alice@test.com', password: '123456' },
    { id: '2', name: 'Bob', email: 'bob@test.com', password: '654321' },
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
    expect(prismaMock.user.findMany).toHaveBeenCalled();
  });

  it('should return one user by id', async () => {
    prismaMock.user.findUnique.mockImplementation(({ where }) =>
      Promise.resolve(mockUsers.find(user => user.id === where.id))
    );

    const user = await userService.findOne('1');

    expect(user).toEqual(mockUsers[0]);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' }});
  });

  it('should create a new user', async () => {
    prismaMock.user.create.mockImplementation(({ data }) =>
      Promise.resolve({ id: mockUsers.length + 1, ...data })
    );

    const newUser = { name: 'Charlie', email: 'charlie@test.com', password: '1a2b3c4a' };
    const createdUser = await userService.create(newUser);

    expect(createdUser).toMatchObject(newUser);
    expect(prismaMock.user.create).toHaveBeenCalledWith({ data: newUser });
  })

  it('should update an user', async () => {
    prismaMock.user.update.mockImplementation(({ where, data }) =>
      Promise.resolve({ ...mockUsers.find(user => user.id === where.id), ...data })
    );

    const user = { name: 'Ítalo' };
    const updatedUser = await userService.update('1', user);

    expect(updatedUser.name).toBe('Ítalo');
    expect(prismaMock.user.update).toHaveBeenCalledWith({ where: { id: '1' }, data: user });
  })

  it('should delete an user', async () => {
    prismaMock.user.delete.mockImplementation(({ where }) =>
      Promise.resolve(mockUsers.find(user => user.id === where.id))
    )

    const deleteUser = await userService.delete('2')

    expect(deleteUser).toEqual(mockUsers[1]);
    expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { id: '2' } });
  })
});
