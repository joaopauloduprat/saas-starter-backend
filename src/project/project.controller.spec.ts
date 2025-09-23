import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ProjectService } from './project.service';
import JwtPayload from '../auth/types/jwt-payload';

describe('ProjectController', () => {
  let projectController: ProjectController;
  let projectServiceMock: DeepMockProxy<ProjectService>;

  const mockUser: JwtPayload = {
    sub: 'user-id-123',
    email: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        { provide: ProjectService, useValue: mockDeep<ProjectService>() },
      ],
    }).compile();

    projectController = module.get(ProjectController);
    projectServiceMock = module.get(ProjectService);
  });

  it('should be defined', () => {
    expect(projectController).toBeDefined();
  });

  it('should create a project for the current user', async () => {
    const projectDto = {
      name: 'New Project',
      description: 'New Project',
    };

    const result = {
      id: 'project-id-123',
      userId: mockUser.sub,
      ...projectDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    projectServiceMock.create.mockResolvedValue(result);

    expect(await projectController.create(mockUser, projectDto)).toEqual(
      result,
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(projectServiceMock.create).toHaveBeenCalledWith(
      mockUser.sub,
      projectDto,
    );
  });

  it('should get all projects for the current user', async () => {
    const result = [
      {
        id: 'project-id-123',
        userId: mockUser.sub,
        name: 'Project 1',
        description: 'Description 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'project-id-124',
        userId: mockUser.sub,
        name: 'Project 2',
        description: 'Description 2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    projectServiceMock.findAll.mockResolvedValue(result);

    expect(await projectController.findAll(mockUser)).toEqual(result);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(projectServiceMock.findAll).toHaveBeenCalledWith(mockUser.sub);
  });

  it('should get a project by id for the current user', async () => {
    const result = {
      id: 'user-id-123',
      userId: mockUser.sub,
      name: 'Project 1',
      description: 'Description 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    projectServiceMock.findOne.mockResolvedValue(result);

    expect(await projectController.findOne(mockUser, 'user-id-123')).toEqual(
      result,
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(projectServiceMock.findOne).toHaveBeenCalledWith(
      mockUser.sub,
      'user-id-123',
    );
  });

  it('should update a project by id for the current user', async () => {
    const updateDto = {
      name: 'Updated Project',
      description: 'Updated Description',
    };

    const result = {
      id: 'user-id-123',
      userId: mockUser.sub,
      ...updateDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    projectServiceMock.update.mockResolvedValue(result);

    expect(
      await projectController.update(mockUser, 'user-id-123', updateDto),
    ).toEqual(result);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(projectServiceMock.update).toHaveBeenCalledWith(
      mockUser.sub,
      'user-id-123',
      updateDto,
    );
  });

  it('should delete a project by id for the current user', async () => {
    const result = {
      id: 'user-id-123',
      userId: mockUser.sub,
      name: 'Project 1',
      description: 'Description 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    projectServiceMock.delete.mockResolvedValue(result);

    expect(await projectController.delete(mockUser, 'user-id-123')).toEqual(
      result,
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(projectServiceMock.delete).toHaveBeenCalledWith(
      mockUser.sub,
      'user-id-123',
    );
  });
});
