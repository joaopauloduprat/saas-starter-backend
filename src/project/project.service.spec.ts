import { PrismaClient, Project } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { ProjectService } from './project.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProjectService', () => {
  let projectService: ProjectService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'Project A',
      description: 'Desc A',
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Project B',
      description: 'Desc B',
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        { provide: PrismaService, useValue: mockDeep<PrismaClient>() },
      ],
    }).compile();

    prismaMock = module.get(PrismaService);
    projectService = module.get(ProjectService);
  });

  it('should be defined', () => {
    expect(projectService).toBeDefined();
  });

  it('should create a project for a user', async () => {
    const dto = { name: 'New Project', description: 'Test' };
    const result = {
      id: '3',
      ...dto,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.project.create.mockResolvedValue(result);

    expect(await projectService.create('1', dto)).toEqual(result);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaMock.project.create).toHaveBeenCalledWith({
      data: { ...dto, userId: '1' },
    });
  });

  it('should return all projects for a user', async () => {
    prismaMock.project.findMany.mockResolvedValue(mockProjects);

    expect(await projectService.findAll('1')).toEqual(mockProjects);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaMock.project.findMany).toHaveBeenCalledWith({
      where: { userId: '1' },
    });
  });

  it('should return a project by id and userId', async () => {
    prismaMock.project.findFirst.mockImplementation(
      (args: any) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        Promise.resolve(
          mockProjects.find(
            (project) =>
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              project.id === args.where.id &&
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              project.userId === args.where.userId,
          ),
        ) as any,
    );

    expect(await projectService.findOne('1', '1')).toEqual(mockProjects[0]);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaMock.project.findFirst).toHaveBeenCalledWith({
      where: { id: '1', userId: '1' },
    });
  });

  it('should update a project', async () => {
    const dto = { name: 'Updated Project' };
    const updated = { ...mockProjects[0], ...dto };

    prismaMock.project.findFirst.mockImplementation(
      (args: any) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        Promise.resolve(
          mockProjects.find(
            (project) =>
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              project.id === args.where.id &&
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              project.userId === args.where.userId,
          ),
        ) as any,
    );

    prismaMock.project.update.mockImplementation(
      ({ where, data }) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        Promise.resolve({
          ...mockProjects.find((project) => project.id === where.id)!,
          ...data,
        }) as any,
    );

    expect(await projectService.update('1', '1', dto)).toEqual(updated);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaMock.project.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: dto,
    });
  });

  describe('remove', () => {
    it('should delete a project', async () => {
      prismaMock.project.findFirst.mockImplementation(
        (args: any) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          Promise.resolve(
            mockProjects.find(
              (project) =>
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                project.id === args.where.id &&
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                project.userId === args.where.userId,
            ),
          ) as any,
      );

      prismaMock.project.delete.mockImplementation(
        ({ where }) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          Promise.resolve(
            mockProjects.find((project) => project.id === where.id)!,
          ) as any,
      );

      expect(await projectService.delete('1', '1')).toEqual(mockProjects[0]);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prismaMock.project.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
